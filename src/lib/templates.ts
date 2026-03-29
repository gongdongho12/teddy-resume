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
  },
  {
    id: 'academic',
    name: 'Academic (Classic)',
    description: '연구/학계/공공기관 제출용으로 적합한 보수적인 세리프체 바탕의 1단 문서 양식',
    category: 'Formal'
  },
  {
    id: 'executive',
    name: 'Executive (Compact)',
    description: '수많은 이력을 한 장 안에 임팩트 있게 밀어넣는 C레벨/관리자용 고밀도 레이아웃',
    category: 'Formal'
  }
];

export type TemplateId = 'default' | 'minimal' | 'creative' | 'academic' | 'executive';

export function isValidTemplate(id: string): id is TemplateId {
  return AVAILABLE_TEMPLATES.some(t => t.id === id);
}
