## Installation
```bash
  git clone https://github.com/mrCleverIdiot/mr_etiquette.git
  cd mr_etiquette
```
```

  npm install && npm node main.js
  cd invoice-generator
  npm install && npm start
```
### Usage with `Mysql` 
> create database `mr_etiqute`
- create table 
```
CREATE TABLE `bill` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `mobile` varchar(15) DEFAULT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `total_amount` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isSent` int DEFAULT NULL,
  `pdf_location` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Legal
> **Warning**
> Whatsapp prohibits the use of unauthirized bots on their platform. Use this at your own risk.
