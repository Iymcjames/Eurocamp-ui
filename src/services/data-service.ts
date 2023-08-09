import { log } from "console";

export class DataService {
  async getOneParc(id: string) {
    let url = `http://localhost:3001/api/1/parcs/${id}`;
    return await this.getOne(url);
  }
  async getOne(url: string) {
    let res = await fetch(url);
    let data = await res.json();
    return data;
  }

  async getOneUser(id: string) {
    let url = `http://localhost:3001/api/1/users/${id}`;
    return await this.getOne(url);
  }

  async getOneBooking(id: string) {
    let url = `http://localhost:3001/api/1/bookings/${id}`;
    return await this.getOne(url);
  }

  async createParc(data: { name: string; description: string }) {
    let url = "http://localhost:3001/api/1/parcs/";
    let response = await this.createData(url, data);
  }

  async createUser(data: any) {
    let url = "http://localhost:3001/api/1/users";
    let response = await this.createData(url, data);
  }

  async createBooking(data: any) {
    let url = "http://localhost:3001/api/1/bookings";
    let response = await this.createData(url, data);
  }
  async createData(url: any, data: { name: string; description: string }) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }
  async getAllBookings() {
    return await this.getData("http://localhost:3001/api/1/bookings");
  }

  async getAllUsers() {
    return await this.getData("http://localhost:3001/api/1/users");
  }

  async getAllParcs() {
    return await this.getData("http://localhost:3001/api/1/parcs");
  }
  async getData(url: string) {
    let res = await fetch(url);
    let data = await res.json();
    return data.data;
  }
}
