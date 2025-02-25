
interface PasswordDetails {
  id: number;
  account: string;
  username?: string;
  email?: string;
  notes?: string;
  password: string;
  createdAt: string;
}

class PasswordManager {
  private STORAGE_KEY = 'passwords';

  getAllPasswords(): PasswordDetails[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting passwords:', error);
      return [];
    }
  }

  addPassword(password: Omit<PasswordDetails, 'id' | 'createdAt'>): PasswordDetails[] {
    try {
      const currentPasswords = this.getAllPasswords();
      const newPassword = {
        ...password,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      const updatedPasswords = [...currentPasswords, newPassword];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPasswords));
      return updatedPasswords;
    } catch (error) {
      console.error('Error adding password:', error);
      throw new Error('Failed to add password');
    }
  }

  deletePassword(id: number): PasswordDetails[] {
    try {
      const currentPasswords = this.getAllPasswords();
      const updatedPasswords = currentPasswords.filter(pwd => pwd.id !== id);
      
      if (currentPasswords.length === updatedPasswords.length) {
        throw new Error('Password not found');
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPasswords));
      return updatedPasswords;
    } catch (error) {
      console.error('Error deleting password:', error);
      throw new Error('Failed to delete password');
    }
  }

  updatePassword(id: number, updates: Partial<PasswordDetails>): PasswordDetails[] {
    try {
      const currentPasswords = this.getAllPasswords();
      const updatedPasswords = currentPasswords.map(pwd => 
        pwd.id === id ? { ...pwd, ...updates } : pwd
      );
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPasswords));
      return updatedPasswords;
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  }
}

export const passwordManager = new PasswordManager();
