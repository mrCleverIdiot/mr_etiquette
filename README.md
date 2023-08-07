
## Installation
1. Clone the repo

## Getting Started

### Quick Start
1. You need to setup your whatsapp client. From the remote directory, run `npm run setup`
2. Wait for it to produce a QR code, scan it with your phone to connect to your number.
6. When it logs `Client is ready!`, close with `shift` and `C`.
7. Then run `npm run start`
8. You are done with the setup! Now you can see console message is sented from csv file

## Installation
Install Whatsapp-Auto-Cannon with npm

```bash
  git clone https://github.com/mrCleverIdiot/Whatsapp-Auto-Cannon.git
  cd Whatsapp-Auto-Cannon
  npm install && npm run start
```
### Usage with `CSV` 
- Do not forgot to chnage in  `messages.csv`
### Usage with `Mysql` 
- change connection string
- create database `whatsapp_auto_cannon`
- create table 
`CREATE TABLE phone_numbers (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  phone_number varchar(15) DEFAULT NULL,
  message text,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
- run script `node mysq_index.js`

## Legal
> **Warning**
> Whatsapp prohibits the use of unauthirized bots on their platform. Use this at your own risk.
