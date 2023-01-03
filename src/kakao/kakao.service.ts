import {
  InternalServerErrorException,
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
        throw new InternalServerErrorException('Kakao Internal Server Error');
      }

      return response.data;
    } catch (e) {
      throw new UnauthorizedException(e, 'Wrong kakaoAccessCode');
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
      console.log(this.addAuthHeader(access_token));
      const response = await axios({
        method: 'get',
        url: url,
        headers: this.addAuthHeader(access_token),
      });

      if (response.status == 500) {
        throw new InternalServerErrorException('Kakao Internal Server Error');
      }

      return [response.data.elements, response.data.total_count];
    } catch (e) {
      throw new UnauthorizedException(e, 'Wrong kakaoAccessCode');
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
      console.log(this.addAuthHeader(access_token));
      const response = await axios({
        method: 'get',
        url: url,
        headers: this.addAuthHeader(access_token),
      });

      if (response.status == 500) {
        throw new InternalServerErrorException('Kakao Internal Server Error');
      }

      return response.data;
    } catch (e) {
      console.log('error', e);
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
      template_args: template_args,
      receiver_uuids: [kakao_uuid],
    };

    try {
      const response = await axios({
        method: 'post',
        url: url,
        headers: this.addAuthHeader(access_token),
        data: qs.stringify(body),
      });

      if (response.status == 500) {
        throw new InternalServerErrorException('Kakao Internal Server Error');
      }

      return response.data;
    } catch (e) {
      throw new UnauthorizedException(e, 'Wrong kakaoAccessCode');
    }
  }
}
