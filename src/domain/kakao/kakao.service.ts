/* eslint-disable @typescript-eslint/no-empty-function */
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import qs from 'qs';

export class KakaoService {
  authHostUrl = 'https://kauth.kakao.com';
  hostUrl = 'https://kapi.kakao.com';

  defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  };

  constructor() {}

  private addAuthHeader(access_token: string) {
    return {
      ...this.defaultHeaders,
      Authorization: `Bearer ${access_token}`,
    };
  }

  /*
   * Receive access tokens with Kakao login authentication code
   * @param code
   * @param redirect_uri
   * @returns {Promise<any>}
   */
  async getKakaoAccessToken(code: string, redirect_uri: string): Promise<any> {
    const authEndpoint = '/oauth/token';
    const url = `${this.authHostUrl}${authEndpoint}`;

    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID,
      redirect_uri: redirect_uri,
      code: code,
    };

    try {
      const response = await axios({
        method: 'post',
        url: url,
        headers: this.defaultHeaders,
        data: qs.stringify(body),
      });

      if (response.status == 500) {
        throw new InternalServerErrorException({
          message: 'Kakao Internal Server Error',
          error: 'Kakao Internal Server Issue Cannot Get Friends',
          status: 500,
        });
      }

      return response.data;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Wrong kakaoAccessCode',
        error: "Can't get kakao access token",
        statusCode: 401,
      });
    }
  }

  async refreshKakaoAccessToken(refresh_token: string): Promise<any> {
    const authEndpoint = '/oauth/token';
    const url = `${this.authHostUrl}${authEndpoint}`;

    const body = {
      grant_type: 'refresh_token',
      client_id: process.env.KAKAO_CLIENT_ID,
      refresh_token: refresh_token,
    };

    try {
      const response = await axios({
        method: 'post',
        url: url,
        headers: this.defaultHeaders,
        data: qs.stringify(body),
      });

      if (response.status == 500) {
        throw new InternalServerErrorException({
          message: 'Kakao Internal Server Error',
          error: 'Kakao Internal Server Issue Cannot Get Friends',
          status: 500,
        });
      }

      const { access_token, token_type, expires_in } = response.data;

      return {
        access_token,
        token_type,
        expires_in,
      };
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Wrong kakaoAccessCode',
        error: "Can't refresh kakao access token",
        statusCode: 401,
      });
    }
  }
  /*
   * Get Kakao Friends and Count
   * @param access_token
   * @returns {Promise<any>}
   */
  async getKakaoFriendsandCount(access_token: string): Promise<any> {
    const friendsEndpoint = '/v1/api/talk/friends';
    const url = `${this.hostUrl}${friendsEndpoint}`;

    try {
      const response = await axios({
        method: 'get',
        url: url,
        headers: this.addAuthHeader(access_token),
      });

      if (response.status == 500) {
        throw new InternalServerErrorException({
          message: 'Kakao Internal Server Error',
          error: 'Kakao Internal Server Issue Cannot Get Friends',
          status: 500,
        });
      }

      if (response.status == 404) {
        return [[], 0];
      }

      return [response.data.elements, response.data.total_count];
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Wrong kakaoAccessCode',
        error: "Can't get kakao friends",
        statusCode: 401,
      });
    }
  }

  /*
   * Get User Kakao Profile
   * @param access_token
   * @returns {Promise<any>}
   * */
  async getKakaoProfile(access_token: string): Promise<any> {
    const profileEndpoint = '/v2/user/me';
    const url = `${this.hostUrl}${profileEndpoint}`;

    try {
      const response = await axios({
        method: 'get',
        url: url,
        headers: this.addAuthHeader(access_token),
      });

      if (response.status == 500) {
        throw new InternalServerErrorException({
          message: 'Kakao Internal Server Error',
          error: 'Kakao Internal Server Issue Cannot Get Friends',
          status: 500,
        });
      }

      if (response.status == 404) {
        throw new UnauthorizedException({
          message: 'Not Registered User',
          error: 'Cannot Get Kakao Profile',
          status: 404,
        });
      }

      return response.data;
    } catch (e) {
      throw new UnauthorizedException(e, 'Wrong kakaoAccessCode');
    }
  }

  /*
   * Send Kakao Message
   * @param access_token
   * @param template_id
   * @param template_args
   * @returns {Promise<any>}
   * */
  async sendKakaoMessage(
    access_token: string,
    kakao_uuid: string,
    template_id: number,
    template_args: any,
  ): Promise<any> {
    const messageEndpoint = '/v1/api/talk/friends/message/send';
    const url = `${this.hostUrl}${messageEndpoint}`;

    const body = {
      template_id: template_id,
      receiver_uuids: '[' + '"' + kakao_uuid + '"' + ']',
      template_args: template_args,
    };

    try {
      const response = await axios({
        method: 'post',
        url: url,
        headers: this.addAuthHeader(access_token),
        data: qs.stringify(body),
      });

      if (response.status == 500) {
        throw new InternalServerErrorException({
          message: 'Kakao Internal Server Error',
          error: 'Kakao Internal Server Issue Cannot Get Friends',
          status: 500,
        });
      }

      if (response.status == 404) {
        throw new NotFoundException({
          message: 'Kakao Friend is not found',
          error: 'Cannot Send Kakao Message',
          status: 404,
        });
      }

      return response.data;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Wrong kakaoAccessCode',
        error: "Can't get kakao friends",
        statusCode: 401,
      });
    }
  }
}
