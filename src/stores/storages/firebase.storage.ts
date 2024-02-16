import { StateStorage, createJSONStorage } from "zustand/middleware";

const FIREBASE_URL = 'https://zustand-storage-57b03-default-rtdb.firebaseio.com/zustand'

const storageAPI: StateStorage = {
  getItem: async function (name: string): Promise<string | null> {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await fetch(`${FIREBASE_URL}/${name}.json`);
      const res = await data.json();
      return JSON.stringify(res);
    } 
    catch (error) {
      throw error;
    }
  },
  setItem: async function (name: string, value: string): Promise<void> {
    const data = await fetch(`${FIREBASE_URL}/${name}.json`, {
      method: 'PUT',
      body: value
    });
    await data.json();
    return;
  },
  removeItem: function (name: string): void | Promise<void> {
    console.log(name)
  }
}

export const firebaseStorage = createJSONStorage(() => storageAPI)