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

function PsalmsWithSchema({ content }) {
    const schema = content.schema || 'ant1_ps1_ant1_ant2_ps2_ant2_ant3_ps3_ant3_ant4_ps4_ant4';
    // console.log('PsalmsWithSchema: rendering with schema', schema);
    return (<>{
        schema.split('_').map((part, index) => {
            // console.log(`PsalmsWithSchema: processing part ${part} of schema. Content for this part:`, content[part]);
            return (
                <p key={index}><Verses content={content[part] || ''} /></p>
            )
        })
    }</>);
}            

export { PsalmsWithSchema } ;
export default Verses ;