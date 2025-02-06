import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // Import HttpService for Axios requests
import { firstValueFrom } from 'rxjs'; // Convert Observable to Promise
import * as dotenv from 'dotenv';
import * as FormData from 'form-data'; // Import form-data
import axios from 'axios';

dotenv.config();

@Injectable()
export class GuestRidesService {
  private readonly clientId = process.env.UBER_CLIENT_ID;
  private readonly clientSecret = process.env.UBER_CLIENT_SECRET;
  private readonly redirectUri = process.env.UBER_REDIRECT_URI;
  private readonly baseUrl = process.env.UBER_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  // Generate the authorization URL for OAuth
  getAuthUrl() {
    //console.log("Generating authorization URL" + this.baseUrl);
    return `${this.baseUrl}/oauth/v2/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&scope=rides.request`;
  }

  async getAccessTokenUsingClientCredentials() {
    try {
      // Create form data to send with POST request
      const data = new FormData();
      data.append('client_id', this.clientId);
      data.append('client_secret', this.clientSecret);
      data.append('grant_type', 'client_credentials');
      data.append('scope', 'support.3p.ticket.read support.3p.ticket.write');

      const headers = {
        ...data.getHeaders(), // Use form-data headers
        'Cookie': 'marketing_vistor_id=ecaf9f36-87d2-47db-81e0-147b8de06606; udi-id=OllQnGbhBBXYI6gZ5MfSPTAUGkSau1w31cRLAvRhbMTyd8mtj/inHd6oHoPmwJ4hf/W2gTsZDlj9wM4IZWbH6neq8/R45TKXtVMK68GuMSr1m2QJxdLDd4/+4UNWjcXnzQvNZrlpG1AIgsunU+5BLge+1XG3q/2j8DSrMpo588SQWkwBMEjI55EiqIryGXz7Z++XMqWiMTEC6hNNT1Pdlg==XYovepvdEt8uVoWW/klS3A==VwDQe/KpU0qJcKS1GX36FhGFBg1joDtrOHFARHSw3is=; x-uber-analytics-session-id=a561429e-c82b-4d02-b207-e5f943acd630; state=JF0333C63bI0EH.1738824392908.d9cGXlLoJ27qIInOH6rDDOg5umTFHTCPa5XoqsMDMho=',
      };

      const response = await firstValueFrom(
        this.httpService.post(
          'https://sandbox-login.uber.com/oauth/v2/token',
          data, // Form data
          { headers }, // Set the custom headers
        ),
      );
      //console.log(response.data);
      return response?.data;
    } catch (error) {
      console.error("Error response:", error.response?.data); // Log the full error response for debugging
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

   // Get Access Token using authorization code
   async getAccessToken(authCode: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/oauth/v2/token`,
          null,
          {
            params: {
              client_id: this.clientId,
              client_secret: this.clientSecret,
              grant_type: 'authorization_code',
              redirect_uri: this.redirectUri,
              code: authCode,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        ),
      );

      return response?.data; // Optional chaining here to access `data`
    } catch (error) {
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  // Get Available Rides based on Latitude and Longitude
  async getAvailableProducts(accessToken: string, latitude: string, longitude: string) {
    try {
      const url = `https://test-api.uber.com/v1.2/products?latitude=${latitude}&longitude=${longitude}`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error calling Uber API:', error);
      throw new Error('Failed to fetch available rides from Uber API');
    }
  }

  // Book a Ride
  async bookRide(accessToken: string, rideDetails: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1.2/requests`,
          rideDetails,
          {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          },
        ),
      );

      return response?.data; // Optional chaining here to access `data`
    } catch (error) {
      throw new Error(`Failed to book ride: ${error.message}`);
    }
  }
}
