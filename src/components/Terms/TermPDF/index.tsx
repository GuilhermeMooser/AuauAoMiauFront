import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Font,
} from "@react-pdf/renderer";
import { Terms } from "@/types/terms";
import { AnimalGender } from "@/types/animal";

// ── Styles ────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 9,
        paddingTop: 32,
        paddingBottom: 40,
        paddingHorizontal: 40,
        color: "#1a1a1a",
    },

    // Header
    headerBox: {
        alignItems: "center",
        marginBottom: 14,
    },
    orgName: {
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 1,
        textTransform: "uppercase",
    },
    orgSubtitle: {
        fontSize: 9,
        color: "#555",
        marginTop: 2,
        letterSpacing: 2,
        textTransform: "uppercase",
    },
    docTitle: {
        fontSize: 13,
        fontFamily: "Helvetica-Bold",
        textDecoration: "underline",
        marginTop: 10,
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    // Section title
    sectionTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        marginTop: 14,
        marginBottom: 4,
        textTransform: "uppercase",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        paddingBottom: 2,
    },

    // Field row
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 5,
        gap: 8,
    },
    field: {
        flexDirection: "row",
        alignItems: "flex-end",
        flex: 1,
        minWidth: 140,
    },
    fieldLabel: {
        fontFamily: "Helvetica-Bold",
        marginRight: 3,
        whiteSpace: "nowrap",
    },
    fieldValue: {
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        flex: 1,
        paddingBottom: 1,
        color: "#333",
    },
    fieldValueFull: {
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        flex: 1,
        paddingBottom: 1,
        color: "#333",
        width: "100%",
    },

    // Body text
    bodyText: {
        marginTop: 12,
        lineHeight: 1.55,
        textAlign: "justify",
        fontSize: 8.5,
    },
    bold: {
        fontFamily: "Helvetica-Bold",
    },
    underline: {
        textDecoration: "underline",
    },

    // Signature area
    signatureRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 32,
    },
    signatureBox: {
        width: "44%",
        alignItems: "center",
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: "#333",
        width: "100%",
        marginBottom: 4,
    },
    signatureLabel: {
        fontSize: 8,
        color: "#444",
    },

    // Warning
    warningBox: {
        marginTop: 24,
        borderWidth: 1,
        borderColor: "#333",
        padding: 8,
        alignItems: "center",
    },
    warningText: {
        fontSize: 8,
        textAlign: "center",
        fontFamily: "Helvetica-Bold",
        textDecoration: "underline",
    },

    // City/date
    cityDate: {
        marginTop: 20,
        fontSize: 9,
    },

    // Commitment term page
    commitmentItem: {
        marginBottom: 5,
        lineHeight: 1.5,
        textAlign: "justify",
        fontSize: 8.5,
    },
    commitmentNumber: {
        fontFamily: "Helvetica-Bold",
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginVertical: 10,
    },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (value: string | null | undefined, fallback = "________________") =>
    value && value.trim() ? value : fallback;

const formatDate = (dateStr: string | null | undefined | Date) => {
    if (!dateStr) return "___/___/______";
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR");
};

const formatCPF = (cpf: string | null | undefined) => {
    if (!cpf) return "___.___.___-__";
    const clean = cpf.replace(/\D/g, "");
    if (clean.length !== 11) return cpf;
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
};

const genderLabel = (gender: AnimalGender | string) =>
    gender === AnimalGender.Male || gender === "M" ? "Macho" : "Fêmea";

const castradoLabel = (castrated: boolean) => (castrated ? "SIM" : "NÃO");

// ── Page 1 – Adoption Responsibility Term ────────────────────────────────────
const Page1 = ({ term }: { term: Terms }) => {
    const { animal, adopter } = term;
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("pt-BR", { month: "long" });
    const year = today.getFullYear();

    const principalContact = adopter.contacts.find(c => c.isPrincipal);

    return (
        <Page size="A4" style={S.page}>
            {/* Header */}
            <View style={S.headerBox}>
                <Text style={S.orgName}>Do Au-Au ao Miau</Text>
                <Text style={S.orgSubtitle}>Proteção Animal</Text>
                <Text style={S.docTitle}>Adoção – Termo de Responsabilidade</Text>
            </View>

            {/* Adopter section */}
            <Text style={S.sectionTitle}>Adotante</Text>

            <View style={S.row}>
                <View style={[S.field, { flex: 3 }]}>
                    <Text style={S.fieldLabel}>Nome:</Text>
                    <Text style={S.fieldValue}>{fmt(adopter.name)}</Text>
                </View>
                <View style={[S.field, { flex: 1, minWidth: 100 }]}>
                    <Text style={S.fieldLabel}>Data de Nasc.:</Text>
                    <Text style={S.fieldValue}>
                        {adopter.dtOfBirth ? formatDate(adopter.dtOfBirth) : "___/___/______"}
                    </Text>
                </View>
            </View>

            <View style={S.row}>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>CPF:</Text>
                    <Text style={S.fieldValue}>{formatCPF(adopter.cpf)}</Text>
                </View>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>Fone:</Text>
                    <Text style={S.fieldValue}>{fmt(principalContact?.value)}</Text>
                </View>
            </View>

            <View style={S.row}>
                <View style={[S.field, { flex: 2 }]}>
                    <Text style={S.fieldLabel}>Email:</Text>
                    <Text style={S.fieldValue}>{fmt(adopter.email)}</Text>
                </View>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>Estado Civil:</Text>
                    <Text style={S.fieldValue}>{fmt(adopter.civilState)}</Text>
                </View>
            </View>

            {adopter.addresses.map((adress, index) => (
                <>
                    {index > 0 && <View style={S.divider} />}
                    <Text style={[S.fieldLabel, { marginBottom: 4, marginTop: index > 0 ? 2 : 0 }]}>
                        Endereço {adopter.addresses.length > 1 ? index + 1 : ""}
                    </Text>
                    <View style={S.row}>
                        <View style={[S.field, { flex: 1 }]}>
                            <Text style={S.fieldLabel}>Logradouro:</Text>
                            <Text style={S.fieldValue}>{fmt(adress.street)}</Text>
                        </View>
                    </View>
                    <View style={S.row}>
                        <View style={[S.field, { flex: 1 }]}>
                            <Text style={S.fieldLabel}>Bairro:</Text>
                            <Text style={S.fieldValue}>{fmt(adress.neighborhood)}</Text>
                        </View>
                        <View style={[S.field, { flex: 1 }]}>
                            <Text style={S.fieldLabel}>Cidade/UF:</Text>
                            <Text style={S.fieldValue}>{`${adress.city.name}/${adress.city.stateUf.name}`}</Text>
                        </View>
                    </View>
                </>
            ))}

            {/* Animal section */}
            <Text style={S.sectionTitle}>Animal</Text>

            <View style={S.row}>
                <View style={[S.field, { flex: 2 }]}>
                    <Text style={S.fieldLabel}>Nome:</Text>
                    <Text style={S.fieldValue}>{fmt(animal.name)}</Text>
                </View>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>Espécie:</Text>
                    <Text style={S.fieldValue}>{fmt(animal.type.type)}</Text>
                </View>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>Raça:</Text>
                    <Text style={S.fieldValue}>{fmt(animal.breed)}</Text>
                </View>
            </View>

            <View style={S.row}>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>Sexo:</Text>
                    <Text style={S.fieldValue}>{genderLabel(animal.gender)}</Text>
                </View>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>Idade:</Text>
                    <Text style={S.fieldValue}>
                        {animal.age != null ? `${animal.age} ${animal.age === 1 ? "ano" : "anos"}` : "______"}
                    </Text>
                </View>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>Castrado:</Text>
                    <Text style={S.fieldValue}>{castradoLabel(!!animal.castrated)}</Text>
                </View>

            </View>

            <View style={S.row}>
                <View style={[S.field, { flex: 1 }]}>
                    <Text style={S.fieldLabel}>Porte:</Text>
                    <Text style={S.fieldValue}>{fmt(animal.size)}</Text>
                </View>
                {animal.dtOfAdoption && (
                    <View style={[S.field, { flex: 1 }]}>
                        <Text style={S.fieldLabel}>Data de Adoção:</Text>
                        <Text style={S.fieldValue}>{formatDate(animal.dtOfAdoption)}</Text>
                    </View>
                )}
            </View>

            {/* Body text */}
            <Text style={S.bodyText}>
                Ao adotar o animal acima descrito declaro-me apto para assumir a guarda e a
                responsabilidade sobre este animal, eximindo o doador de toda e qualquer
                responsabilidade por quaisquer atos praticados pelo animal a partir desta data.
                Declaro ainda estar ciente de todos os cuidados que este animal exige no que se
                refere à sua guarda e manutenção, além de conhecer todos os riscos inerentes à
                espécie no convívio com humanos, estando apto a guardá-lo e vigiá-lo,
                comprometendo-me a proporcionar boas condições de alojamento, sem acesso à rua,
                e alimentação, assim como, espaço físico que possibilite o animal se exercitar.
                Responsabilizo-me por preservar a saúde e integridade do animal e a submetê-lo
                aos cuidados médicos veterinários sempre que necessário para este fim, repetindo
                uma dose anualmente, e CASTRANDO-O no prazo máximo de 60 (sessenta) dias, caso
                já não tenha sido castrado pelo doador.{"\n\n"}
                <Text style={S.bold}>
                    Comprometo-me a não transmitir a posse deste animal a outrem sem o
                    conhecimento do doador, podendo responder judicialmente caso fazê-lo.
                </Text>{" "}
                Comprometo-me também, a permitir o acesso do doador ao local onde se encontra o
                animal para averiguação de suas condições. Tenho conhecimento de que caso seja
                constatado por parte do doador situação inadequada para o bem estar do animal,
                ou não cumprimento do termo de adoção,{" "}
                <Text style={S.underline}>perderei a sua guarda</Text>, sem prejuízo das
                penalidades legais. Comprometo-me a{" "}
                <Text style={S.underline}>manter o doador atualizado</Text> sobre a situação do
                animal, sempre dialogando com cordialidade e respeito. Comprometo-me a cumprir
                toda a legislação vigente, municipal, estadual e federal, relativa à posse de
                animais.
            </Text>

            <Text style={[S.bodyText, S.bold]}>
                Declaro-me assim, ciente das normas acima, as quais aceito, assinando o
                presente Termo de Responsabilidade em duas vias, assumindo plenamente os deveres
                que nele constam, bem como outros relacionados à posse responsável e que não
                estejam incluídos neste Termo.
            </Text>

            {/* City and date */}
            <Text style={S.cityDate}>
                Guarapuava, {day} de {month} de {year}
            </Text>

            {/* Signatures */}
            <View style={S.signatureRow}>
                <View style={S.signatureBox}>
                    <View style={S.signatureLine} />
                    <Text style={S.signatureLabel}>Assinatura do Doador</Text>
                </View>
                <View style={S.signatureBox}>
                    <View style={S.signatureLine} />
                    <Text style={S.signatureLabel}>Assinatura do Adotante</Text>
                </View>
            </View>

            {/* Warning */}
            <View style={S.warningBox}>
                <Text style={S.warningText}>
                    "Abandono e maus-tratos a animais é crime. Quando se tratar de cao ou gato, a
                    pena sera de reclusao, de 2 (dois) a 5 (cinco) anos, multa e proibicao da
                    guarda. Art. 32 da Lei no 9.605/98"
                </Text>
            </View>
        </Page>
    );
};

// ── Page 2 – Commitment Term ──────────────────────────────────────────────────
const Page2 = ({ term }: { term: Terms }) => {
    const { animal, adopter } = term;
    const today = new Date();

    const items = [
        "Comprometo-me e cuidar bem do animal adotado ate seu ultimo dia de vida, sabendo que a vida de caes e gatos podem chegar a ate 20 anos.",
        "Atesto que ja tomei (ou tomarei muito em breve) todas as medidas possiveis para garantir a seguranca e o bem-estar do animal adotado, como por exemplo telas em janelas de apartamentos, cercas ou muros em casas com patio, coleira e guia para passeios diarios, local para agua e alimento e um local confortavel para o descanso.",
        "Se minha residencia for um apartamento, comprometo-me a realizar no minimo dois passeios diarios com o animal para que ele possa fazer suas necessidades e realizar atividades para gasto de energia.",
        "Se minha residencia for uma casa, comprometo-me a deixar o animal sempre solto no patio e com acesso livre a espacos cobertos da casa, de forma que sempre fique protegido das intemperies (frio, calor, chuva etc). Comprometo-me a nunca, sob qualquer hipotese, manter o animal adotado preso a qualquer tipo de corrente ou em cubiculos ou espacos minusculos.",
        "Declaro tambem que, caso minha residencia seja alugada, nao ha qualquer impeditivo por parte do proprietario, condominio ou imobiliaria que me proiba de ter um animal de estimacao.",
        "No caso de eu ja possuir outros animais em casa, asseguro que ha espacos para prevenir briga territorial e me comprometo a buscar todos os meios disponiveis para fazer a adaptacao entre o animal adotado e os animais mais antigos que estao comigo. Comprometo-me a nunca deixar o animal sozinho por mais de 10h, providenciando sempre pessoas que possam cuida-lo e alimenta-lo caso necessite de periodos maiores de afastamento.",
        "Comprometo-me a alimentar o animal adotado com racao de qualidade Premium ou superior.",
        "Comprometo-me a realizar visitas periodicas ao veterinario, bem como a manter a vacinacao e vermifugacao em dia.",
        "Comprometo-me a arcar com todas as despesas e dedicar todo o tempo necessario para que o animal adotado tenha plena saude e qualidade de vida.",
        "Comprometo-me a castrar o animal adotado assim que ele atingir a idade adequada (acima de 6 meses para femea e acima de 1 ano para machos).",
        "Caso o animal fuja, comprometo-me a comunicar imediatamente o Do Auau ao Miau e a realizar tudo que for necessario para a localizacao dele, independentemente dos custos e envolvimento acarretados nas buscas.",
        "Se por motivos de forca maior (doencas graves, acidentes etc.) eu ficar impossibilitado de continuar a ser o protetor do animal adotado, e tiver qualquer intencao de transferir a guarda dele para outra pessoa, comprometo-me a comunicar imediatamente o Santuario Voz Animal para que o novo adotante passe pelo mesmo processo de adocao.",
        "Comprometo-me a fornecer as informacoes solicitadas pela equipe de acompanhamento pos-adocao do Do Auau ao Miau sempre que me for solicitado e/ou de forma espontanea.",
        "Caso ocorram quaisquer problemas com o animal adotado ou com o processo de adocao em si, comprometo-me a avisar, imediatamente, o Do Auau ao Miau, para que, juntos, possamos buscar a melhor solucao.",
    ];

    return (
        <Page size="A4" style={S.page}>
            {/* Header */}
            <View style={S.headerBox}>
                <Text style={S.orgName}>Do Au-Au ao Miau</Text>
                <Text style={S.orgSubtitle}>Proteção Animal</Text>
                <Text style={S.docTitle}>Termo de Compromisso</Text>
            </View>

            {/* Intro */}
            <Text style={S.bodyText}>
                Eu (nome completo){" "}
                <Text style={S.bold}>{fmt(adopter.name)}</Text>, ciente das minhas
                obrigações enquanto adotante do{" "}
                <Text style={S.bold}>{fmt(animal.name)}</Text> (nome do animal), dou
                ciência dos compromissos assumidos com o Do Au-Au ao Miau listados a seguir:
            </Text>

            <View style={S.divider} />

            {/* Items */}
            {items.map((item, index) => (
                <Text key={index} style={S.commitmentItem}>
                    <Text style={S.commitmentNumber}>{index + 1}) </Text>
                    {item}
                </Text>
            ))}

            {/* Footer clause */}
            <Text style={[S.bodyText, { marginTop: 10 }]}>
                A partir da assinatura deste termo, declaro ciencia que, no caso do nao
                cumprimento ou violacao de qualquer um dos compromissos acima expostos e
                assumidos por mim, o animal podera retornar a guarda do Santuario Voz Animal,
                por descumprimento a Lei Federal 9.605 de Protecao Animal, contra maus tratos e
                abandono. Reservo ainda ao Do Auau ao Miau o direito de fiscalizar o integral
                cumprimento das obrigacoes acordadas pelo presente instrumento, bem como
                promover a aplicacao das penalidades previstas em lei no caso de qualquer
                descumprimento deste acordo.
            </Text>

            {/* City and date */}
            <Text style={S.cityDate}>
                Guarapuava,{" "}
                {today.getDate()} de{" "}
                {today.toLocaleString("pt-BR", { month: "long" })} de{" "}
                {today.getFullYear()}
            </Text>

            {/* Signatures */}
            <View style={S.signatureRow}>
                <View style={S.signatureBox}>
                    <View style={S.signatureLine} />
                    <Text style={S.signatureLabel}>Assinatura do Doador</Text>
                </View>
                <View style={S.signatureBox}>
                    <View style={S.signatureLine} />
                    <Text style={S.signatureLabel}>Assinatura do Adotante</Text>
                </View>
            </View>
        </Page>
    );
};

// ── Document ──────────────────────────────────────────────────────────────────
const TermDocument = ({ term }: { term: Terms }) => (
    <Document
        title={`Termo de Adoção – ${term.animal.name}`}
        author="Do Au-Au ao Miau"
        subject="Termo de Responsabilidade e Compromisso de Adoção"
    >
        <Page1 term={term} />
        <Page2 term={term} />
    </Document>
);

// ── Export helpers ────────────────────────────────────────────────────────────

/** Generate a Blob from a Terms object and open it in a new tab */
export async function openTermPDF(term: Terms): Promise<void> {
    const blob = await pdf(<TermDocument term={term} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    // Optionally revoke after a delay to free memory
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Generate a Blob from a Terms object (for download or preview) */
export async function generateTermPDF(term: Terms): Promise<Blob> {
    return pdf(<TermDocument term={term} />).toBlob();
}

/** Download the PDF directly */
export async function downloadTermPDF(term: Terms): Promise<void> {
    const blob = await generateTermPDF(term);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `termo-adocao-${term.animal.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export default TermDocument;
