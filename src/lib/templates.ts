export const AVAILABLE_TEMPLATES = [
  { 
    id: 'default', 
    name: 'Default (Modern)', 
    description: '기본 템플릿. 짙은 네이비 헤더와 단정한 2단 구성',
    category: 'General'
  },
  { 
    id: 'minimal', 
    name: 'Minimal (Clean)', 
    description: '컬러를 배제하고 타이포그래피와 여백만으로 구조를 나눈 흑백 레이아웃',
    category: 'General'
  },
  { 
    id: 'creative', 
    name: 'Creative (Vibrant)', 
    description: '프론트엔드/디자이너 등 개성 있는 스타일',
    category: 'Visual'
  }
];

export type TemplateId = 'default' | 'minimal' | 'creative';

export function isValidTemplate(id: string): id is TemplateId {
  return AVAILABLE_TEMPLATES.some(t => t.id === id);
}
