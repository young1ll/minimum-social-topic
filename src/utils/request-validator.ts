import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

const validationError = async (data: any): Promise<ValidationError[] | false> => {
    const error = await validate(data, {
        validationError: { target: true },
    });

    if (error.length) {
        return error;
    }

    return false;
};

export const RequestValidator = async <T>(
    type: ClassConstructor<T>,
    body: T
): Promise<{ errors: boolean | string; input: T }> => {
    const input = plainToClass(type, body);
    const errors = await validationError(input);

    if (errors) {
        const errorMessages = errors
            .map((error: ValidationError) => (Object as any).values(error.constraints))
            .join(', ');
        return { errors: errorMessages, input };
    }

    return { errors: false, input };
};
