export abstract class ApiService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  protected async getAll(): Promise<T[]> {
    const res = await fetch(`/api/${this.endpoint}`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch ${this.endpoint}`);
    return await res.json();
  }

  protected async getById(id: string): Promise<T | null> {
    const res = await fetch(`/api/${this.endpoint}/${id}`, { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  }

  protected async add(item: T): Promise<T> {
    const res = await fetch(`/api/${this.endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(`Failed to add to ${this.endpoint}`);
    return await res.json();
  }

  protected async update(id: string, updatedItem: Partial<T>): Promise<T> {
    const res = await fetch(`/api/${this.endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedItem),
    });
    if (!res.ok) throw new Error(`Failed to update ${this.endpoint}`);
    return await res.json();
  }

  protected async delete(id: string): Promise<void> {
    const res = await fetch(`/api/${this.endpoint}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Failed to delete from ${this.endpoint}`);
  }
}