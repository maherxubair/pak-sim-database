<h1 align="center">Pak SIM Database</h1>

## Overview

A responsive web interface for querying Pakistan's SIM database information using the NexOracle API. This application allows users to search for SIM owner details by phone number or CNIC.

## Features

- Clean, modern UI with dark mode
- Responsive design for all devices
- Dual API integration (free and paid)
- Real-time search results
- Save details info PDF
- Latest sim database details
- Whatsapp Contact Support
- Detailed information display including:
  - Owner name
  - All numbers
  - CNIC number
  - Address
  - Network operator
- About Section
- FAQ section
- Notification system

## Deployment Instructions

### Vercel

1. _Create [Vercel Account](https://vercel.com/signup) if you don't Have_
2. _Fork this [Repository](https://github.com/maherxubair/pak-sim-database/fork)_
3. _Then goto vercel => Connect your githhub => Add New => Project => Connect the Forked Repo => Deploy and done_
4. _You can also deploy via this [Deploy Link](https://vercel.com/new/clone?repository-url=https://github.com/maherxubair/pak-sim-database)_

### Github Pages

1. _Fork this [Repository](https://github.com/maherxubair/pak-sim-database/fork)_
2. _Then goto Forked repo Settings => Pages => Select Branch Main => Save and Done_

### Netlify

1. _Fork this [Repository](https://github.com/maherxubair/pak-sim-database/fork)_
2. _Create [Netlify Account](https://netlify.com/signup), if you don't have_
3. _Import from Github => Connect your github => select your Forked Repo => Deploy and Done_
4. _You can also upload this repo files into Netlify to deploy_

### Others

_This is a Static Website, you can deploy it anywhere you like, as Static Deployments is free on every hosting platform_

## For Developers

### Custom Deployment

If you want to deploy your own version of this SIM database website:

1. You need purchase a VIP API key for cnic and full number searches
2. The free API key only provides details upto 1 sim number only

### API Features Comparison

#### Free API Key

**A Free ApiKey is Already Included in Script with Higher Limits**

- Limited to single number lookups
- Basic owner information
- Rate limited
- Get free key at: [NexOracle](https://api.nexoracle.com)

#### VIP API Key

- Full CNIC searches
- Multiple number lookups
- Complete owner details
- Higher rate limits
- Fast response time
- Priority support
- Purchase at: [NexOracle](https://api.nexoracle.com/auth/buy-plan?planType=VIP)

### Customization Options

- Update free or paid Api Keys in `src/script.js` at line 100, 101
- Change Whatsapp contact Link in `src/script.js` at line 102
- Modify colors or animation in `tailwind.config.js`
- Update FAQ questions or etc in `index.html`
- Change API endpoints in the `src/script.js`

## Support

For API key issues or technical support:

- [WhatsApp](https://wa.me/923466319114)
- [Email](mailto:support@nexoracle.com)
