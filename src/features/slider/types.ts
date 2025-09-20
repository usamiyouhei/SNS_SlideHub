export type Mode = 'lesson' | 'gallery'

export type SlideText =
|{  id: string;
  type: 'text';
  text: string;
  fontSize:number;
  bg?: string;
  color?: string;
  editing?: boolean;
}

export type SlideImage =
|{  id: string;
  type: 'image';
  src: string
}

export type Slide = SlideText | SlideImage


export type SlideState = Record<Mode,Slide[]>