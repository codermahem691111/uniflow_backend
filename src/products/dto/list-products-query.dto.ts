import { PageQueryDto } from '../../common/pagination/page-query.dto';

/** Products only support the shared paging and search options. */
export class ListProductsQueryDto extends PageQueryDto {}
