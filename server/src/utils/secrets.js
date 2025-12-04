import fs from 'fs';

export const getSecret = (secretName, envVarName) => {
    const secretPath = process.env[secretName + '_FILE']; 
    
    // Primary: check if secret file path is provided and file exists
    if (secretPath && fs.existsSync(secretPath)) {
        return fs.readFileSync(secretPath, 'utf8').trim();
    }

    // Fallback: check environment variable
    if (process.env[envVarName]) {
        return process.env[envVarName];
    }

    throw new Error(`CRITICAL ERROR: Secret ${secretName} is missing! Application cannot start.`);
};