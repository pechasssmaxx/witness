# $WITNESS: The Last Human Token

$WITNESS is a conceptual blockchain project on the Solana network that serves as a real-time monitor of humanity in an era increasingly dominated by AI agents.

## Core Objective

In 2026, the Solana ecosystem is populated by autonomous AI agents that trade, interact, and launch tokens. $WITNESS provides the infrastructure to distinguish human market signals from automated bot activity, creating a narrative-driven "Human Index."

## Technical Features

### On-Chain Analytics
The platform leverages the Helius API to perform deep analysis of Solana transaction data. By scanning Jito bundles and detecting specific automated patterns, it calculates a Proof of Humanity score for any given contract address.

### Bot Detection Logic
- **Transaction Frequency**: Analyses the time intervals between swaps to identify sub-second execution typical of bots.
- **Bundle Identification**: Detects Jito-managed transactions often used by sophisticated bundling bots.
- **Weighted Metrics**: Adjusts the index based on average trade size and volume distribution.

### Last Human Mode
A dynamic visualization state triggered when the Human Index falls below 50%. The interface shifts to a "Red Alarm" state, simulating a system compromise to signal high bot dominance.

### Ecosystem Integration
- **Live Market Data**: Integrated DexScreener charts and price feeds.
- **Wallet Connectivity**: Support for Phantom wallet interaction.
- **Audit Tools**: A public Human Index Checker for analyzing third-party tokens.

## Visual Design

The project features a high-fidelity cyberpunk aesthetic, including:
- Dynamic grid backgrounds and scanline overlays.
- A custom "Glitch Engine" for ambient visual effects.
- Real-time Transaction Heartbeat (EKG) canvas animation.
- Matrix-style terminal visuals.

## Repository Structure

- `index.html`: Main interface and application entry point.
- `js/app.js`: Core logic for on-chain analysis and UI state management.
- `css/style.css`: Comprehensive design system and animations.
- `config.js`: Centralized configuration for API keys and social links.
- `assets/`: Optimized visual media and branding elements.

## Setup and Configuration

1. Obtain a Solana RPC API key from [Helius](https://helius.xyz/).
2. Update the `HELIUS_KEY` constant in `config.js`.
3. Configure project links (Twitter, Telegram, BUY URL) in the same file.
4. Deploy the contents to any static hosting provider (e.g., GitHub Pages).

## Disclaimer

$WITNESS is a narrative-driven project. All data provided through the Human Index is for experimental and entertainment purposes only. This is not financial advice.
