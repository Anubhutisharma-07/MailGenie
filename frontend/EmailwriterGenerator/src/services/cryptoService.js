/**
 * WebCrypto-based Zero-Knowledge Client-Side Encryption Service.
 * Implements AES-GCM-256 with PBKDF2 key derivation from user master passphrase.
 */

const PBKDF2_ITERATIONS = 100000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

export class CryptoService {
    /**
     * Derives an AES-GCM-256 CryptoKey from a user passphrase and cryptographic salt.
     * @param {string} passphrase User master passphrase
     * @param {Uint8Array} salt Cryptographic random salt
     * @returns {Promise<CryptoKey>}
     */
    static async deriveKey(passphrase, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            enc.encode(passphrase),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Encrypts plaintext data into a self-contained ciphertext bundle.
     * @param {string} plaintext Sensitive text (email draft / template)
     * @param {string} passphrase User master passphrase
     * @returns {Promise<{ ciphertext: string, iv: string, salt: string }>}
     */
    static async encrypt(plaintext, passphrase) {
        const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
        const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
        const key = await this.deriveKey(passphrase, salt);

        const enc = new TextEncoder();
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            enc.encode(plaintext)
        );

        return {
            ciphertext: this.arrayBufferToBase64(encryptedBuffer),
            iv: this.arrayBufferToBase64(iv),
            salt: this.arrayBufferToBase64(salt)
        };
    }

    /**
     * Decrypts an encrypted ciphertext bundle back into plaintext.
     * @param {string} ciphertextBase64 Base64 encoded ciphertext
     * @param {string} ivBase64 Base64 encoded IV
     * @param {string} saltBase64 Base64 encoded salt
     * @param {string} passphrase User master passphrase
     * @returns {Promise<string>} Decrypted plaintext
     */
    static async decrypt(ciphertextBase64, ivBase64, saltBase64, passphrase) {
        const salt = this.base64ToArrayBuffer(saltBase64);
        const iv = this.base64ToArrayBuffer(ivBase64);
        const ciphertext = this.base64ToArrayBuffer(ciphertextBase64);
        const key = await this.deriveKey(passphrase, new Uint8Array(salt));

        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(iv) },
            key,
            ciphertext
        );

        const dec = new TextDecoder();
        return dec.decode(decryptedBuffer);
    }

    static arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    static base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
