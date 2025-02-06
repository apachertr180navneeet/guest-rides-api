import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { GuestRidesService } from './guest-rides.service';

@ApiTags('Guest Rides')
@Controller('guest-rides')
export class GuestRidesController {
  constructor(private readonly guestRidesService: GuestRidesService) {}

  @Get('auth')
  @ApiOperation({ summary: 'Get OAuth Authorization URL' })
  @ApiResponse({ status: 200, description: 'Returns the Uber OAuth URL' })
  getAuthUrl() {
    return { url: this.guestRidesService.getAuthUrl() };
  }

  @Post('oauth')
  @ApiOperation({ summary: 'Get OAuth Authorization URL' })
  @ApiResponse({ status: 200, description: 'Returns the Uber OAuth URL' })
  getoauthUrl() {
    return this.guestRidesService.getAccessTokenUsingClientCredentials();
  }

  @Get('auth/callback')
  @ApiOperation({ summary: 'Handle OAuth Callback & Retrieve Access Token' })
  @ApiQuery({ name: 'code', required: true, description: 'Authorization Code from Uber' })
  @ApiResponse({ status: 200, description: 'Returns access token' })
  async getToken() {
    try {
      const tokenData = await this.guestRidesService.getAccessTokenUsingClientCredentials();
      return tokenData;
    } catch (error) {
      return { message: 'Error retrieving access token', error: error.message };
    }
  }

  @Get('available')
  @ApiOperation({ summary: 'Get Available Uber Rides' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'access_token', required: true, description: 'Uber API Access Token' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Pickup Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Pickup Longitude' })
  @ApiResponse({ status: 200, description: 'Returns available Uber ride options' })
  async getAvailableRides(
    @Query('access_token') accessToken: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    try {
      // Call service to process the available rides
      const availableRides = await this.guestRidesService.getAvailableProducts(
        accessToken,
        lat,
        lng,
      );
      return availableRides;
    } catch (error) {
      console.error('Error:', error);
      return { statusCode: 500, message: 'Internal Server Error' };
    }
  }

  @Post('book')
  @ApiOperation({ summary: 'Book a Ride' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'access_token', required: true, description: 'Uber API Access Token' })
  @ApiResponse({ status: 201, description: 'Ride successfully booked' })
  async bookRide(@Query('access_token') accessToken: string, @Body() rideDetails: any) {
    return await this.guestRidesService.bookRide(accessToken, rideDetails);
  }
}
