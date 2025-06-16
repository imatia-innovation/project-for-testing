export const ASSIGNMENT_METHOD = {
    FIRST_OFFER: ' Aceptar primera oferta ',
    MANUAL_ASSIGNMENT: ' Asignación manual ',
};

export const ASSIGNMENT_METHOD_DEFAULT =
    process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'pre'
        ? ASSIGNMENT_METHOD.MANUAL_ASSIGNMENT
        : ASSIGNMENT_METHOD.FIRST_OFFER;
