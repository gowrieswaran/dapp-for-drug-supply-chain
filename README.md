# Architect a Blockchain Solution for Drug Supply Chain

## Introduction

One of the biggest challenges with supply chains is the lack of transparency in product tracking which leads to increased costs, counterfeit goods, and unnecessary waste. From the food on our table to the luxury handbags on store shelves - how can we trust the products we buy?

## Blockchain - The solution

A Blockchain-based supply chain management solution can provide more accurate tracking, helping reduce fraud by transparently tracking product origination.

## Drug Supply Chain

The pharmaceutical industry has a particularly complex supply chain, with many varied stakeholders involved in the manufacture and distribution of a single drug. Blockchain offers an opportunity to simplify the process and enable quality control throughout the supply chain.

## How it works ?

Drug supply chain solution involves using Blockchain for tracking the authenticity of the drug, starting from the manufacturer via the distributor to the pharmacist. It ensures that the pharmacist receives the original drug without the drug entering the gray market.

### Actors

- Pharmacist
- Distributor
- Manufacturer

## Blockchain Solution for Drug Supply Chain

I have taken the resupply phase of the drug supply chain, wherein it starts from the manufacturer and reaches the pharmacist. As it passes throught each stage, an event is emitted and corresponding Transaction hash is created. All the transactions are logged with the hash throughout the phase and thereby, the item can be tracked.

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Please make sure you've already installed ganache-cli, Truffle and enabled MetaMask extension in your browser.

### How to Run

1.Clone/download the project repo.

2.In the command prompt, run: npm install

3.Launch Ganache <seed-word>

4.In a separate terminal window, Compile smart contracts:

`truffle compile`

This will create the smart contract artifacts in folder build\contracts.

5.Migrate smart contracts to the locally running blockchain, ganache-cli:

`truffle migrate`

6.Test smart contracts:

`truffle test`

7.In a separate terminal window, launch the DApp:

`npm run dev`
