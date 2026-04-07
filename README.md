# Japan "Lost Decades" Portfolio Stress Test

A specialized financial simulation tool designed to stress-test a retirement portfolio against the historical economic conditions of Japan’s "Lost Decades" (1990–2020). 

This interactive web application allows users to model how a diversified portfolio of Australian shares (**VAS**), International shares (**VGS**), and Japanese Government Bonds (**JGB**) would have fared during one of the most challenging deflationary environments in modern history.

## 🚀 Key Features

* **Waterfall Rebalancing Strategy:** Implements a logic-driven "Buy the Laggard" algorithm. Surplus income is used to top up the cash buffer first, then automatically directed to the asset class furthest below its target allocation.
* **Dynamic Cash Buffer:** Models a `BILL` ETF (Cash) buffer that acts as the primary source for spending during market downturns.
* **Flexible Spend Rules:** Features a "Floor and Ceiling" spending model. The simulation attempts to maintain an annual spend, reducing it toward a floor during negative growth years and increasing it with CPI during recoveries.
* **Real-Time Visualization:** Powered by **Chart.js**, providing instant feedback on portfolio value, annual spending history, and cash buffer depletion.
* **Sydney-Centric Tax Modeling:** Includes a tax calculator tailored for Australian residents, accounting for grossed-up franking credits and personal income tax brackets.

## 📊 The Scenario: 1990–2020

The simulation uses a customized data array (`script.js`) representing 31 years of Japanese economic history, including:
* **The Initial Crash (1990–1992)**
* **The Dot-com Boom/Bust**
* **The Global Financial Crisis (GFC)**
* **The Euro Crisis and COVID-19 Era**

Interest rates (JGB and Cash) are lowered within the data set to accurately reflect the Japanese interest rate collapse.

## 🛠️ Tech Stack

* **HTML5/CSS3:** Responsive layout using CSS Grid and Flexbox.
* **Vanilla JavaScript:** Core simulation logic, tax calculations, and data processing.
* **Chart.js:** For high-performance, interactive data visualization.

## 📂 Project Structure

```text
├── index.html   # Main UI structure and control sliders
├── style.css    # Clean, minimalist aesthetic with responsive design
└── script.js    # Simulation engine, historical data, and rebalancing logicG
