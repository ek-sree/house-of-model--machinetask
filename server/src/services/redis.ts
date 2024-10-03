import { createClient } from 'redis';
import { IUserinterface } from '../interface/userInterface';
import { ISellerinterface } from '../interface/sellerInterface';

const client = createClient({
    url: 'redis://localhost:6379'  
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

export async function initRedis() {
    try {
        await client.connect();
        console.log('Redis client connected');

        // Test the connection
        await client.set('test', 'value');
        const testValue = await client.get('test');
        console.log('Redis test:', testValue);

        if (testValue !== 'value') {
            throw new Error('Redis test failed');
        }
    } catch (error) {
        console.error('Redis initialization error:', error);
        throw error;
    }
}

export const otpSetData = async (data: IUserinterface, otp: string) => {
    try {
        const userKey = `user:${data.email}`;

        console.log("Setting user data...");
        await client.hSet(userKey, 'userName', data.userName);
        await client.hSet(userKey, 'email', data.email);
        await client.hSet(userKey, 'phone', data.phone || '');
        await client.hSet(userKey, 'password', data.password);
        await client.hSet(userKey, 'role', data.role);
        
        console.log("Setting expiration...");
        await client.expire(userKey, 420); // 7 minutes

        console.log("Setting OTP...");
        await client.set(`otp:${data.email}`, otp, { EX: 120 }); // 2 minutes

        console.log("User data and OTP set with expiration");
    } catch (error) {
        console.error("Error setting user data and OTP:", error);
        throw error;
    }
}



export const getUserData = async (email: string): Promise<IUserinterface | null> => {
    try {
        const userData = await client.hGetAll(`user:${email}`);
        if (Object.keys(userData).length === 0) {
            return null; 
        }
        
        const user: IUserinterface = {
            userName: userData.userName,
            email: userData.email,
            phone: userData.phone || '',
            password: userData.password,
            role: userData.role
        };
        return user;
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
};

export const getOtp = async (email: string): Promise<string | null> => {
    try {
        const otp = await client.get(`otp:${email}`);
        return otp;
    } catch (error) {
        console.error('Error retrieving OTP:', error);
        return null;
    }
};

// Seller functions

export const otpSetSellerData = async (data: ISellerinterface, otp: string) => {
    try {
        const sellerKey = `seller:${data.email}`;

        console.log("Setting seller data...");
        await client.hSet(sellerKey, 'userName', data.userName);
        await client.hSet(sellerKey, 'email', data.email);
        await client.hSet(sellerKey, 'password', data.password);
        await client.hSet(sellerKey, 'role', data.role);

        console.log("Setting expiration...");
        await client.expire(sellerKey, 420); // 7 minutes

        console.log("Setting OTP...");
        await client.set(`otp:${data.email}`, otp, { EX: 120 }); // 2 minutes

        console.log("Seller data and OTP set with expiration");
    } catch (error) {
        console.error("Error setting seller data and OTP:", error);
        throw error;
    }
}



export const getSellerData = async (email: string): Promise<ISellerinterface | null> => {
    try {
        const sellerData = await client.hGetAll(`seller:${email}`);
        if (Object.keys(sellerData).length === 0) {
            return null; 
        }
        
        const seller: ISellerinterface = {
            userName: sellerData.userName,
            email: sellerData.email,
            password: sellerData.password,
            role: sellerData.role
        };
        return seller;
    } catch (error) {
        console.error('Error retrieving seller data:', error);
        return null;
    }
};

// Simple test function
export const testRedisOperation = async () => {
    try {
        const testKey = 'test:key';
        console.log("Setting test value...");
        await client.set(testKey, 'test');
        
        console.log("Getting test value...");
        const testValue = await client.get(testKey);
        
        console.log("Test value:", testValue);
        
        if (testValue !== 'test') {
            throw new Error('Redis test failed');
        }
        
        console.log("Test completed successfully");
    } catch (error) {
        console.error("Error in Redis test operation:", error);
        throw error;
    }
}

export default client;