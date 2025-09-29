export type Mode = 'lesson' | 'gallery'

// export type SlideText =
// |{  
//   id: string;
//   type: 'text';
//   text: string;
//   fontSize:number;
//   bg?: string;
//   color?: string;
//   editing?: boolean;
// }

// export type SlideImage =
// |{  
//   id: string;
//   type: 'image';
//   src: string;
//   text?: string;
//   fontSize?: number;
//   color?: string;
// }

// export type Slide = SlideText | SlideImage
export type Slide = {
  id: string;
  bgType: 'color' | 'image';
  bgColor?: string;
  bgImage?: string;

  // テキスト共通（全スライドで使う）
  text?: string;
  fontSize?: number;
  color?: string;
}


export type SlideState = Record<Mode,Slide[]>