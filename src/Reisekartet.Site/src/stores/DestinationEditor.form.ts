import {defineStore} from "pinia";
import type {Destination, DestinationType} from "@/api/Models/Destination";
import {ref} from "vue";
import {useForm} from "vee-validate";
import * as Yup from "yup";
import {useDestinationStore} from "@store/Destinations";
import {assertWrappingType} from "graphql/type";

interface DestinationEditorForm {
        name: string;
        latitude: string;
        longitude: string;
        website: string | null;
        type: DestinationType;
}

const destinationTypes = ["RESTAURANT", "HOTEL", "ATTRACTION", "NATURE", "OTHER"] as DestinationType[];


const schema = Yup.object({
        name: Yup.string().required(),
        latitude: Yup.number().min(-90).max(90).required(),
        longitude: Yup.number().min(-180).max(180).required(),
        website: Yup.string().url().nullable(),
       
        
})

export const useDestinationEditorForm = defineStore('DestinationsEditorForm', () => {
        const destinations = useDestinationStore();
        const {errors, useFieldModel, handleSubmit} = useForm<DestinationEditorForm>(
            {
                    validationSchema: schema,
                    initialValues: {
                            name: '',
                            latitude: '0',
                            longitude: '0',
                            website: null,
                            type: '' as DestinationType,

                    }
                }
        );
        const [name, latitude, longitude, website, type] = useFieldModel(["name", "latitude", "longitude", "website", "type"]);
        
        const onSubmit = handleSubmit(async (values) => {
                const destination: Destination = {
                        description: "",
                        id: null,
                        location: {
                                latitude: Number.parseFloat(values.latitude),
                                longitude: Number.parseFloat(values.longitude),
                        }, 
                        name: values.name,
                        type: values.type, 
                        website: values.website
                    }
                ;
                await destinations.create(destination);

        });
        
        function hasErrors() : boolean {
            console.log(errors.value);
            console.log(errors.value.name);
            console.log(errors.value.latitude);
            console.log(errors.value.longitude);
            console.log(errors.value.website);
            
                return false;
                    ;
        }
        
        return {
                name,
                latitude,
                longitude,
                website,
                type,
                destinationTypes,
                errors,
                onSubmit,
                hasErrors
        };
    
}

//         destination: (state) : Destination => {
//             return {
//                 description: "", 
//                 id: "",
//                 name: state.name,
//                 location: {
//                     latitude: Number.parseFloat(state.latitude),
//                     longitude: Number.parseFloat(state.longitude),
//                 },
//                 website: state.website,
//                 type: state.type
//             };
//         }
//     },
//     actions: {
//         reset() {
//             this.name = '';
//             this.latitude = '0';
//             this.longitude = '0';
//             this.website = null;
//             this.type = '' as DestinationType;
//         }
//     },
// }

)
