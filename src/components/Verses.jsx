function Verses({ content }) {
    if (Array.isArray(content)) {
        return (content.map((line, index) => (
            <span key={index}>{line}<br/></span>
        )))
    } else if ((typeof content === 'string') && content.includes('\n')) {
        return (content.split('\n').map((line, index) => (
            <span key={index}>{line}<br/></span>
        ))) 
    } else {
        return <span>{content}</span>;
    }
}
export default Verses ;