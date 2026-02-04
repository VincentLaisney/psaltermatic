const initial_verset=["Deus in adjutorium meum intende.",
"Domine ad adjuvandum me festina.",
"Gloria Patri et Filio et Spiritui Sancto.",
"Sicut erat in principio et nunc et semper et in saecula saeculorum.",
"Amen."];
const hymne_sexte=["Rector potens, verax Deus,",
"Qui temperas rerum vices,",
"Splendore mane instruis,",
"Et ignibus medidiem.",
"",
"Exstíngue flammas lítium,",
"Aufer calórem nóxium,",
"Confer salútem córporum,",
"Verámque pacem córdium.",
"",
"Præsta, Pater piíssime,",
"Patríque compar Unice,",
"Cum Spíritu Paráclito",
"Regnans per omne sǽculum.",
"Amen."]
const ant_sexte_dom=`Alléluia, alléluia, alléluia.`
const Dom_sexte={
    Ps1: 118_8,
    Ps2: 118_9,
    Ps3: 118_10,
    capit: `Alter altérius ónera portáte, ★ et sic adimplébitis \
    legem Christi. Deo grátias.`,
    vers: `Dóminus regit me, et nihil mihi déerit.
In loco páscuæ ibi me collocávit.`
};
const kyrie = `Kýrie eléison. Christe eléison.
Kýrie eléison.`
const pater_silent = `Pater noster,
Sed líbera nos a malo`;
const dominus_vobiscum = `Dóminus vobíscum.
Et cum spíritu tuo.`;
const oratio = `Orémus.
Omnípotens sempitérne Deus, qui nos per hanc \
diem ad salutáre tempus pervénire facis, \
da nobis, quǽsumus, ut, inter mundi vanitátem \
et cæléstia quæréntes, ad te semper aspirémus. \
Per Christum Dóminum nostrum. Amen.`;
const benedicamus = `Benedicámus Dómino.
Deo grátias.`;
const fidelium_animae = `Fidelium ánimæ per misericórdiam Dei requiéscant in pace. Amen.`;
const divinum = ["Divínum auxílium maneat semper nobíscum.",
"Et cum frátribus nostris abséntibus. Amen."];
const psaumes = {
    118_8: ["Pórtio mea, Dómine, ★ dixi custodíre legem tuam. ",
"Deprecátus sum fáciem tuam in toto corde meo : ★ miserére mei secúndum elóquium tuum.",
"Cogitávi vias meas : ★ et convér ti pedes meos in testimónia tua.",
"Parátus sum, et non sum turbátus : ★ ut custódiam mandáta tua.",
"Funes peccatórum circumpléxi sunt me : ★ et legem tuam non sum oblítus.",
"Média nocte surgébam ad confiténdum tibi, ★ super iudícia iustificatiónis tuæ.",
"Párticeps ego sum ómnium timéntium te : ★ et custodiéntium mandáta tua.",
"Misericórdia tua, Dómine, plena est terra : ★ iustificatiónes tuas doce me."],
    118_9: ["Bonitátem fecísti cum servo tuo, Dómine, ★ secúndum verbum tuum.",
"Bonitátem et disciplínam et sciéntiam doce me : ★ quia mandátis tuis crédidi.",
"Priúsquam humiliárer, ego delíqui : ★ proptérea elóquium tuum custodívi.",
"Bonus es tu : ★ et in bonitáte tua doce me iustificatiónes tuas.",
"Multiplicáta est super me iníquitas superbórum : ★ ego autem in toto corde meo scrutábor mandáta tua.",
"Coagulátum est sicut lac cor eórum : ★ ego vero legem tuam meditátus sum.",
"Bonum mihi, quia humiliásti me : ★ ut discam iustificatiónes tuas.",
"Bonum mihi lex oris tui, ★ super míllia auri et argénti."],
    118_10: ["Manus tuæ fecérunt me, et plasmavérunt me : ★ da mihi intelléctum, et discam mandáta tua.",
"Qui timent te, vidébunt me, et lætabúntur : ★ quia in verba tua supersperávi.",
"Cognóvi, Dómine, quia ǽquitas iudícia tua : ★ et in veritáte tua humiliásti me.",
"Fiat misericórdia tua, ut consolétur me, ★ secúndum elóquium tuum servo tuo.",
"Véniant mihi miseratiónes tuæ, et vivam : ★ quia lex tua meditátio mea est.",
"Confundántur supérbi, quia iniúste iniquitátem fecérunt in me : ★ ego autem exercébor in mandátis tuis.",
"Convertántur mihi timéntes te : ★ et qui novérunt testimónia tua.",
"Fiat cor meum immaculátum in iustificatiónibus tuis, ★ ut non confúndar."],
};
export {initial_verset, hymne_sexte, ant_sexte_dom, Dom_sexte,
kyrie, pater_silent, dominus_vobiscum, oratio, benedicamus,
fidelium_animae, divinum, psaumes
}