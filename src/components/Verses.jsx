function Verses({ content }) {
    if (Array.isArray(content)) {
        return (content.map((line, index) => (
            <span key={index}>{line}<br/></span>
        )))
    } else {
        return null;
    }
}
export default Verses ;