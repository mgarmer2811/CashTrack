import {
    HouseIcon,
    BookOpenIcon,
    BadgeIcon,
    PopcornIcon,
    BubblesIcon,
    HospitalIcon,
    ReceiptIcon,
    CarFrontIcon,
    PizzaIcon,
} from "lucide-react";

const CATEGORY_MAP = {
    1: {
        name: "VIVIENDA",
        icon: HouseIcon,
    },
    2: {
        name: "COMIDA Y COMPRAS(CASA)",
        icon: PizzaIcon,
    },
    3: {
        name: "TRANSPORTE",
        icon: CarFrontIcon,
    },
    4: {
        name: "SUSCRIPCIONES",
        icon: ReceiptIcon,
    },
    5: {
        name: "SALUD",
        icon: HospitalIcon,
    },
    6: {
        name: "ASEO PERSONAL",
        icon: BubblesIcon,
    },
    7: {
        name: "OCIO",
        icon: PopcornIcon,
    },
    8: {
        name: "EDUCACION",
        icon: BookOpenIcon,
    },
    9: {
        name: "OTROS",
        icon: BadgeIcon,
    },
};

export default CATEGORY_MAP;
