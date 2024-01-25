import { Request } from 'express';
import ipAddr from 'ipaddr.js';

export const getClientIp = (req: Request) => {
    const ipString = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const ip = ipAddr.IPv4.parse(ipString as string);

    return ip.toString();
};
