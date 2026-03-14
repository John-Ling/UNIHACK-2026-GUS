export interface Node {
  id: number;
  name: string;
  group: number;
}

export interface Link {
  source: number | Node;
  target: number | Node;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}