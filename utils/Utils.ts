export class Utils {
  /**
   * Validates if a string is a valid Solana address format
   * @param address - The address string to validate
   * @returns true if the address is valid, false otherwise
   */
  static isValidSolanaAddress(address: string): boolean {
    // Check length (44 characters for base58 encoded 32-byte address)
    if (address.length !== 44) return false;
    
    // Check base58 encoding (valid characters: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz)
    const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    if (!base58Regex.test(address)) return false;
    
    // Should not contain invalid base58 characters (0, O, I, l)
    if (/[0OIl]/.test(address)) return false;
    
    return true;
  }
}