import React from "react"

interface ReactMarkdownProps {
	children: string
	components?: Record<string, React.ComponentType<any>>
	className?: string
}

const ReactMarkdown: React.FC<ReactMarkdownProps> = ({
	children,
	components,
	className,
}) => {
	return (
		<div className={className} data-testid="react-markdown">
			{children}
		</div>
	)
}

export default ReactMarkdown
