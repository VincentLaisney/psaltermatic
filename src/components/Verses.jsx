function Verses({ content }) {
    // console.log(`Verses: rendering content:`, content);
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

function TextWithRef({ content }) {
    if (!content) return null;
    if (typeof content === 'string') {
        return <Verses content={content} />;
    } else if (typeof content === 'object' && content.text) {
        return (
            <span>
                {content.ref && <span style={{ display: 'block', marginTop: '0.5em', textAlign: 'right', fontStyle: 'italic' }}>{content.ref}</span>}
                <p><Verses content={content.text} /></p>
            </span>
        );
    } else {
        console.warn('TextWithRef: unexpected content format', content);
        return null;
    }
}

function PsalmsWithSchema({ content, defaultSchema }) {
    const schema = content.schema || defaultSchema || 'ant1_ps1_ant1_ant2_ps2_ant2_ant3_ps3_ant3_ant4_ps4_ant4';
    console.log('PsalmsWithSchema: rendering with schema', schema);
    return (<>{
        schema.split('_').map((part, index) => {
            // console.log(`PsalmsWithSchema: processing part ${part} of schema. Content for this part:`, content[part]);
            return (
                <p key={index}><Verses content={content[part] || ''} /></p>
            )
        })
    }</>);
}            

export { PsalmsWithSchema, TextWithRef }; ;
export default Verses ;