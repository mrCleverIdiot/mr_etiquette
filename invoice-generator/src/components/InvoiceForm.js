import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '₹',
      currentDate: '',
      invoiceNumber: 0,
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: 'Mr Etiquette',
      billFromEmail: '',
      billFromAddress: 'G-15, Alekh Complex, Leela Circle, Bhavnagar',
      notes: '- માલ માં કોઈ પણ પ્રકાર ની ગેરંટી આપવામાં આવતી નથી.',
      notes1: '- બિલ તથા ટેગ વગર માલ બદલી અપમાં આવશે નહીં.',
      notes2: '',
      notes3: '',
      notes4: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '',
      taxAmmount: '0.00',
      discountRate: '',
      discountAmmount: '0.00'
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '0',
        quantity: 1
      }
    ];
    this.editField = this.editField.bind(this);
  }

  componentDidMount(prevProps) {
    this.handleCalculateTotal()
  }
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  };
  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    }
    this.state.items.push(items);
    this.setState(this.state.items);
  }
  handleCalculateTotal = async () => {
    try {
      const response = await fetch("http://localhost:9090/getInvoiceNumber");      
      if (!response.ok) {
        // Check for non-OK status (4xx or 5xx)
        alert("There was issue in getting bill id")
      }
      const data = await response.json();
      const currentInvoiceNumber = data.invoiceNumber;
      const newInvoiceNumber = (parseInt(currentInvoiceNumber) + 1).toString();


      const items = this.state.items;
      let subTotal = 0;

      items.forEach((item) => {
        subTotal += parseFloat(item.price) * parseInt(item.quantity);
      });

      const subTotalFormatted = parseFloat(subTotal).toFixed(2);
      const taxAmount = parseFloat(subTotal * (this.state.taxRate / 100)).toFixed(2);
      const discountAmount = this.state.discountRate;
      const total = (subTotal - discountAmount + parseFloat(taxAmount)).toFixed(2);

      this.setState({
        invoiceNumber: newInvoiceNumber,
        subTotal: subTotalFormatted,
        taxAmmount: taxAmount,
        discountAmmount: discountAmount,
        total
      });
    } catch (error) {
      console.error('Error fetching invoice number:', error);
    }
  };

  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var items = this.state.items.slice();
    var newItems = items.map(function (items) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({ items: newItems });
    this.handleCalculateTotal();
  };
  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.handleCalculateTotal();
  };
  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };
  openModal = (event) => {
    event.preventDefault()
    this.handleCalculateTotal()
    this.setState({ isOpen: true })
  };
  closeModal = (event) => this.setState({ isOpen: false });
  render() {
    return (<Form onSubmit={this.openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div class="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div class="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Customer Details:</Form.Label>
                <Form.Control placeholder={"Name ?"} rows={3} value={this.state.billTo} type="text" name="billTo" className="my-2" onChange={(event) => this.editField(event)} autoComplete="name" required="required" />
                <Form.Control placeholder={"Mobile ?"} value={this.state.billToEmail} type="text" name="billToEmail" className="my-2" onChange={(event) => this.editField(event)} required="required" />
              </Col>
            </Row>
            <InvoiceItem onItemizedItemEdit={this.onItemizedItemEdit.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} currency={this.state.currency} items={this.state.items} />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:
                  </span>
                  <span>{this.state.currency}
                    {this.state.subTotal}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>

                    {this.state.currency}
                    {this.state.discountAmmount || 0}</span>
                </div>
                <hr />
                <div className="d-flex flex-row align-items-start justify-content-between" style={{
                  fontSize: '1.125rem'
                }}>
                  <span className="fw-bold">Total:
                  </span>
                  <span className="fw-bold">{this.state.currency}
                    {this.state.total || 0}</span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            {/* <Form.Label className="fw-bold">Notes:</Form.Label> */}
            {/* <Form.Control placeholder="Thanks for your business!" name="notes" value={this.state.notes} onChange={(event) => this.editField(event)} as="textarea" className="my-2" rows={1}/> */}
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100">Review Invoice</Button>
            <InvoiceModal showModal={this.state.isOpen} closeModal={this.closeModal} info={this.state} items={this.state.items} currency={this.state.currency} subTotal={this.state.subTotal} taxAmmount={this.state.taxAmmount} discountAmmount={this.state.discountAmmount} total={this.state.total} />
            <Form.Group className="mb-3">
            </Form.Group>
            <Form.Group className="my-3">
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="discountRate" type="number" value={this.state.discountRate} onChange={(event) => this.editField(event)} className="bg-white border" placeholder="0.0" />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  ₹
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>)
  }
}

export default InvoiceForm;
