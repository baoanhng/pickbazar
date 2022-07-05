import Pagination from '@components/ui/pagination';
import { Table } from '@components/ui/table';
import ActionButtons from '@components/common/action-buttons';
import dayjs from 'dayjs';
import { Product, ReviewPaginator, SortOrder } from '@ts-types/generated';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@utils/locals';
import { useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { siteSettings } from '@settings/site.settings';
import ReviewCard from './review-card';
import { useRouter } from 'next/router';
import TitleWithSort from '@components/ui/title-with-sort';
import { StarIcon } from '@components/icons/star-icon';
import { useModalAction } from '@components/ui/modal/modal.context';

export type IProps = {
  reviews: ReviewPaginator | undefined | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const ReviewList = ({ reviews, onPagination, onSort, onOrder }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, paginatorInfo } = reviews!;
  const { alignLeft } = useIsRTL();
  const { openModal } = useModalAction();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  function openAbuseReportModal(id: string) {
    openModal('ABUSE_REPORT', {
      model_id: id,
      model_type: 'Review',
    });
  }

  let columns = [
    {
      title: t('table:table-item-image'),
      dataIndex: 'product',
      key: 'product-image',
      align: alignLeft,
      width: 120,
      render: (product: Product) => (
        <Image
          src={product?.image?.thumbnail ?? siteSettings.product.placeholder}
          alt={product?.name}
          layout="fixed"
          width={60}
          height={60}
          className="overflow-hidden rounded"
        />
      ),
    },
    {
      title: t('table:table-item-customer-review'),
      key: 'review',
      align: alignLeft,
      width: 650,
      render: (record: any) => <ReviewCard review={record} />,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-ratings')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'rating'
          }
          isActive={sortingObj.column === 'rating'}
        />
      ),
      key: 'rating',
      className: 'cursor-pointer',
      align: 'center',
      width: 300,
      onHeaderCell: () => onHeaderClick('rating'),
      render: (record: any) => (
        <div className="inline-flex items-center rounded-full text-accent shrink-0 text-base px-3 py-0.5 border border-accent">
          {record?.rating}
          <StarIcon className="w-3 h-3 ms-1" />
        </div>
      ),
    },
    {
      title: t('table:table-item-products'),
      dataIndex: 'product',
      key: 'product-name',
      align: alignLeft,
      width: 300,
      render: (product: Product) => (
        <a
          href={process.env.NEXT_PUBLIC_SHOP_URL + '/products/' + product?.slug}
          className="transition-colors hover:text-accent"
          target="_blank"
        >
          {product?.name}
        </a>
      ),
    },
    {
      title: t('table:table-item-reports'),
      key: 'report',
      align: 'center',
      width: 300,
      render: (record: any) => {
        if (router.query.shop) {
          return (
            <span className="font-bold">{record?.abusive_reports_count}</span>
          );
        }
        return (
          <>
            <span className="font-bold">{record?.abusive_reports_count}</span>
            {record?.abusive_reports_count > 0 && (
              <a
                href={`${router.asPath}/${record?.id}`}
                className="text-sm transition-colors hover:text-accent ms-2"
                target="_blank"
              >
                ({t('text-details')})
              </a>
            )}
          </>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-date')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'created_at',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 90,
      render: (id: string) => {
        if (router?.query?.shop) {
          return (
            <button onClick={() => openAbuseReportModal(id)}>
              {t('common:text-report')}
            </button>
          );
        }
        return <ActionButtons id={id} deleteModalView="DELETE_REVIEW" />;
      },
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          rowClassName="align-top"
          emptyText={t('table:empty-table-data')}
          data={data}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default ReviewList;
