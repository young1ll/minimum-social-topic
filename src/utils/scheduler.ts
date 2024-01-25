import cron, { ScheduleOptions } from 'node-cron';

export const startScheduler = async ({
    cronExpression,
    scheduledFn,
    options,
}: {
    cronExpression: string;
    scheduledFn: () => Promise<void>;
    options?: ScheduleOptions;
}) => {
    const task = cron.schedule(
        cronExpression,
        async () => {
            try {
                await scheduledFn();

                console.log('Scheduled function executed successfully');
            } catch (error) {
                const err = error as Error;
                console.error(err.message);
            }
        },
        {
            ...options,
        }
    );
};
