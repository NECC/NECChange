export interface FeedPostsI {
    postsArray: Array<FeedPostI>
}


export interface FeedPostI {
    fromUC: string,     // UC name             
    fromType: number,    // UC Type
    fromShift: number,   // UC Shift
    toUC: string, 
    toType: number,
    toShift: number,
    tradeID: number,
    studentNumber: number,
    studentYear: number,
    displayName: string,
    timePassed: number,
    profilePic: string,
    dataFrom: string,
    dataTo: string,
}

export interface UnidadesCurricularesI {
    AlgebraLinearCc?: boolean,
    Calculo?: boolean,
    ProgramacaoFuncional?: boolean,
    TopicosDeMatematica?: boolean,
    MatematicaDasCoisas?: boolean,
    EducacaoCidadaniaEDireitosHumanos?: boolean,
    InglesAcademico?: boolean,
    CidadaniaDigital?: boolean,
    SustentabilidadeAmbientalSocialEEconomica?: boolean,
    LiteraciaFotograficaDaFisicaAMensagem?: boolean,
    SubstanciasQueMudaramOMundo?: boolean,
    TopicosDeAstronomiaECosmologia?: boolean,
    IntroducaoALinguaECulturaRussa?: boolean,
    Bilinguismo?: boolean,
    DemocraciaPlenaResponsabilidadeEEstadoDeDireito?: boolean,
    DireitoLaboral?: boolean,
    PrincipiosDeGestaoEGestaoDeInventarios?: boolean,
    AChinaNoMundo?: boolean,
    DesportoESaude?: boolean,
    SistemasDeComputacao?: boolean,
    Analise?: boolean,
    Geometria?: boolean,
    MatematicaDiscreta?: boolean,
    ProgramacaoImperativa?: boolean,
    LaboratorioDeAlgoritmiaI?: boolean,
    AutomatosELinguagensFormais?: boolean,
    CalculoDeProgramas?: boolean,
    ProgramacaoOrientadaAosObjetos?: boolean,
    SistemasOperativos?: boolean,
    AlgebraUniversalECategorias?: boolean,
    BasesDeDados?: boolean,
    ComputabilidadeEComplexidade?: boolean,
    LogicaComputacional?: boolean,
    ProbabilidadesEAplicacoes?: boolean,
    ProcessamentoDeLinguagensECompiladores?: boolean,
    ComputacaoGrafica?: boolean,
    TeoriaDeNumerosComputacional?: boolean,
    ProgramacaoConcorrente?: boolean,
    InteracaoEConcorrencia?: boolean,
    SemanticaDasLinguagensDeProgramacao?: boolean,
    Projeto?: boolean,
}