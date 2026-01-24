import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset & Preflight-like styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    font-family: 'Inter', 'Noto Sans KR', sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    color: #111827; /* gray-900 */
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.25;
  }

  /* List */
  ul, ol {
    list-style: none;
  }

  /* Buttons */
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Images */
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Anchor */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Table */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  /* Input/Textarea */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }
`;
