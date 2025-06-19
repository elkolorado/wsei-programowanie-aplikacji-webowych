export abstract class ApiService<T> {
    private storageKey: string;
  
    constructor(storageKey: string) {
      this.storageKey = storageKey;
    }
  
    // Get all items from localStorage
    protected getAll(): T[] {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }

    // Get a single item by its ID
    protected getById(id: string): T | null {
      const items = this.getAll();
      const found = items.find((item: any) => item.id === id);
      return found !== undefined ? found : null;
    }
  
    // Save all items to localStorage
    protected saveAll(items: T[]): void {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  
    // Add a new item
    add(item: T): void {
      const items = this.getAll();
      items.push(item);
      this.saveAll(items);
    }
  
    // Update an existing item
    update(updatedItem: T, matchFn: (item: T) => boolean): void {
      const items = this.getAll().map((item) =>
        matchFn(item) ? updatedItem : item
      );
      this.saveAll(items);
    }
  
    // Delete an item
    delete(matchFn: (item: T) => boolean): void {
      const items = this.getAll().filter((item) => !matchFn(item));
      this.saveAll(items);
    }
  
    // Find an item by a condition
    find(matchFn: (item: T) => boolean): T | undefined {
      return this.getAll().find(matchFn);
    }
  }