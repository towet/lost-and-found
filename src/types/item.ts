export interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  image_url?: string;
  type: 'lost' | 'found';
  claim_requirements?: string[];
  reward?: string;
  created_at: string;
  user_email: string;
  contact_info?: {
    name: string;
    department: string;
  };
}
