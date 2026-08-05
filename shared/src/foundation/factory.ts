export interface Factory<TRequest, TResult> {

    create(request: TRequest): Promise<TResult>;

}