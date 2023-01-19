import FungiService from "../services/FungiService";
import { Request, Response } from 'express';
// import { resourceLimits } from "worker_threads";
// import { request } from "http";

export default class FungiController {

    private service:FungiService
    constructor(service: FungiService) {
            this.service=service;
    }

    getAllFungi = async (req: Request, res: Response) => {
        let results = await this.service.getAllFungiWithFamilyName()
        res.json(results);
    }

}