
export type PlatformType = 'YouTube' | 'Instagram' | 'TikTok' | 'Twitch' | 'Chzzk';

export interface Creator {
  id: string;
  name: string;
  platform: PlatformType;
  status: '활동중' | '휴식중' | '계약만료' | '대기중' | '종료';
  subscribers: string;
  avatarUrl: string;
  coverUrl: string;
  tags: string[];
  category?: string;
  manager?: string;
  managementStartDate?: string; // 담당 시작일
  managementEndDate?: string;   // 담당 종료일
  channelName?: string;
  contactInfo?: string;
  contractStatus: 'Signed' | 'Drafting' | 'Expired' | 'None';
  // New fields for login credentials
  loginId?: string;
  password?: string;
}

export interface Task {
  id: string;
  title: string;
  status: '진행중' | '완료됨'; // Removed '대기중'
  assignee: string;
  creatorId?: string;
}

export interface CreatorEvent {
    id: string;
    creatorId: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'live' | 'content' | 'meeting' | 'other' | 'joint';
    content?: string;
    partnerCreators?: string[]; // List of Creator IDs for joint broadcasts
}

export interface AdProposal {
  id: string;
  creatorId: string;
  brandName: string;
  campaignTitle: string;
  budget: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
  description: string;
  targetDate?: string; // Added target schedule date
}

export interface HealthRecord {
    id: string;
    name: string;
    lastCheck: string;
    score: number; // 0-100
    result: string;
    status: string;
}

export interface IssueLog {
    id: number;
    creator: string;
    date: string;
    category: string;
    description: string;
    status: string;
}
