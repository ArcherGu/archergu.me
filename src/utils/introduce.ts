export interface Introduce {
  words: string
  keyword: string[]
  color: string[]
  weight: number
}

export const myIntroduce: Introduce[] = [
  {
    words: 'Hi, I\'m Archer Gu.',
    keyword: ['Archer Gu 👋'],
    color: ['#7DB9DE'],
    weight: 10,
  },
  {
    words: 'I\'m a software engineer in Ningbo.',
    keyword: ['Software Engineer 🧑‍💻', 'Ningbo'],
    color: ['#E03C8A', '#FFB11B'],
    weight: 6,
  },
  {
    words: 'I do full-stack development 😎',
    keyword: ['Full-stack ✅'],
    color: ['#1E90FF'],
    weight: 7,
  },
  {
    words: 'I\'m passionate about Vue.js and Vite.',
    keyword: ['Vue.js', 'Vite⚡'],
    color: ['#3eaf7c', '#ba38fe'],
    weight: 6,
  },
  {
    words: 'I also like React and AngularJS.',
    keyword: ['React', 'AngularJS'],
    color: ['#61dafb', '#dd0031'],
    weight: 5,
  },
  {
    words: 'I like writing Node.js backends like Nest.js.',
    keyword: ['Node.js', 'Nest.js ⭐'],
    color: ['#43853d', '#ea2845'],
    weight: 6,
  },
  {
    words: 'I\'m learning WebGL/WebGPU and often use ThreeJS.',
    keyword: ['WebGL/WebGPU 🚀', 'three.js'],
    color: ['#7B90D2', '#049EF4'],
    weight: 5,
  },
  {
    words: 'I also work on DevOps. I love Cloud-Native!',
    keyword: ['DevOps 🔁', 'Cloud-Native ⛅'],
    color: ['#40E0D0', '#c53490'],
    weight: 5,
  },
  {
    words: 'Kubernetes, Gitlab, Docker, they are my best mates!',
    keyword: ['Kubernetes', 'Gitlab', 'Docker 📦'],
    color: ['#326ce5', '#fc6d26', '#2297ed'],
    weight: 6,
  },
  {
    words: 'I often hang out on Github. Open source is cool!',
    keyword: ['Github', 'Open Source'],
    color: ['#555', '#33a6b8'],
    weight: 6,
  },
  {
    words: 'Video game and movie are my favorite!',
    keyword: ['Video Games 🎮', 'Movies 🎥'],
    color: ['#B481BB', '#F19483'],
    weight: 6,
  },
]
