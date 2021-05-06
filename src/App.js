import useSWR from 'swr'
import { css } from '@emotion/css'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import docPath from './pages/functional-programming.md'
import remarkToc from 'remark-toc'
import remarkSlug from 'remark-slug'

const classes = {
  App: css({
    minHeight: '100vh'
  }),
  Header: css({
    fontSize: '3rem',
    padding: '1.5rem 1rem',
    margin: '0 0 1.5rem',
    background: '#444',
    color: '#bd93f9',
  }),
  Main: css({
    padding: '1rem',
  })
}

const markdownComponents = {
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter 
        style={codeStyle} 
        language={match[1]} 
        children={String(children).replace(/\n$/, '')} 
        {...props} 
      />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
}

const docFetcher = (
  url
) => fetch(`${document.location.origin}${url}`)
  .then(docPromise => docPromise.text())

function App() {
  const { data: doc, error } = useSWR(docPath, docFetcher)

  if (!doc) {
    return (
      <div>loading data...</div>
    )
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <div className={classes.App}>
      <header>
        <h1 className={classes.Header}>
          Presentations
        </h1>
      </header>
      <main className={classes.Main}>
        <ReactMarkdown 
          remarkPlugins={[
            remarkSlug,
            remarkToc, 
          ]}
          components={markdownComponents}
        >
          {doc}
        </ReactMarkdown>
      </main>
    </div>
  );
}

export default App;
