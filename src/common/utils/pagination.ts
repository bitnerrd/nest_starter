/* // ? Parameters
model (any): The Mongoose model to query against. This is used to execute the aggregation pipeline.

pipeline (any): An optional array of MongoDB aggregation pipeline stages. This is used to filter or modify the data before applying pagination.

options (object): Optional settings for pagination and sorting. The options object can contain:

page (number): The current page number. Defaults to 1.

limit (number): The number of records per page. Defaults to 10.

pagination (boolean): Whether to apply pagination. Defaults to true.

sortBy (string): The field to sort by. This should be a field name in the collection.

sortOrder ("asc" | "desc" | any): The order to sort by. Either "asc" (ascending) or "desc" (descending). Defaults to "asc" if not provided.
 */
export async function runPaginationProcess({
  model,
  pipeline,
  options,
}: {
  model: any;
  pipeline?: any;
  options?: {
    page?: number;
    limit?: number;
    pagination?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc" | any;
  };
}) {
  if (!options) options = { page: 1, limit: 10, pagination: true };

  const { page = 1, limit = 10, pagination = true } = options;

  const skip = (page - 1) * limit;

  const paginationStages = [{ $skip: skip }, { $limit: limit }];

  const sortStage = options.sortBy
    ? [{ $sort: { [options.sortBy]: options.sortOrder === "asc" ? 1 : -1 } }]
    : [];

  const finalPipeline = [
    ...pipeline,
    ...sortStage,
    ...(pagination ? paginationStages : []),
  ];
  // console.log(`final pipeline`);
  // console.dir(finalPipeline, { depth: null });

  const countPipeline = [
    ...pipeline,
    { $group: { _id: null, totalCount: { $sum: 1 } } },
    { $project: { _id: 0, totalCount: 1 } },
  ];
  // console.log(`count pipeline`);
  // console.dir(countPipeline, { depth: null });

  const pipelinedRecords = await model.aggregate(finalPipeline).exec();
  const recordsCount = await model.aggregate(countPipeline).exec();
  const totalCount = recordsCount[0] ? recordsCount[0].totalCount : 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: pipelinedRecords,
    records: totalCount,
    pages: pagination ? totalPages : null,
    currentPage: pagination ? page : null,
    limit: pagination ? limit : null,
    hasNextPage: pagination ? page < totalPages : null,
    hasPrevPage: pagination ? page > 1 : null,
  };
}
