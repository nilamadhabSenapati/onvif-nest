const axios = require('axios');
const xml2js = require('xml2js');

// Enter your ONVIF camera details
const ONVIF_IP = 'http://<camera-ip>/onvif/media_service'; // Replace with actual camera IP
const USERNAME = 'admin';  // Replace with your ONVIF username
const PASSWORD = 'admin';  // Replace with your ONVIF password

// Function to send SOAP request
async function getVideoEncoderConfigOptions(profileToken = '', configToken = '') {
    const soapBody = `
      <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
        <s:Body>
          <GetVideoEncoderConfigurationOptions xmlns="http://www.onvif.org/ver10/media/wsdl">
            ${profileToken ? `<ProfileToken>${profileToken}</ProfileToken>` : ''}
            ${configToken ? `<ConfigurationToken>${configToken}</ConfigurationToken>` : ''}
          </GetVideoEncoderConfigurationOptions>
        </s:Body>
      </s:Envelope>
    `;

    try {
        const response = await axios.post(ONVIF_IP, soapBody, {
            headers: {
                'Content-Type': 'application/soap+xml',
            },
            auth: {
                username: USERNAME,
                password: PASSWORD,
            },
        });

        // Parse XML response
        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            console.log(JSON.stringify(result, null, 2));
        });

    } catch (error) {
        console.error('ONVIF Request Failed:', error.message);
    }
}

// Call function
getVideoEncoderConfigOptions();
