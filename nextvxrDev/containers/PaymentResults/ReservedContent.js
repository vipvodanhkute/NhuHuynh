import React from 'react';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import get from 'lodash.get';
import ListCompanyAgent from 'vxrd/components/Base/ListCompanyAgent';
import CopyText from 'vxrd/components/Base/CopyText';
import { PAYMENT_METHOD } from '#/utils/constants';

const ReservedContentContainer = styled.div``;

const PaymentInstructionContainer = styled.div`
  .transfer-note {
    padding: 0 10px 10px 10px;
    font-style: italic;
  }
  div {
    margin-bottom: 10px;
  }
  .link-style {
    border-bottom: 1px solid #7ab1f5;
  }
  .transfer-info {
    background: #c7dbf1;
    div.item {
      padding: 15px;
      margin-bottom: 0px;
      div {
        display: inline-block;
      }
      div:first-child {
        width: 30%;
      }
    }
    div.item:not(:last-child) {
      background-image: linear-gradient(to right, #FFB400 30%, rgba(255, 255, 255, 0) 0%);
      background-position: bottom;
      background-size: 10px 3px;
      background-repeat: repeat-x;
    }
  }
`;

class ReservedContent extends React.Component {
  getPaymentInstructionContent = () => {
    const { bookingInfo, intl, handleSendGATracking } = this.props;
    const { paymentTypeId } = bookingInfo;
    switch (paymentTypeId) {
      case PAYMENT_METHOD.SHOP_NEAR_HOME.id: {
        return (
          <>
            {bookingInfo.convenienceStoreAddress ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: intl.formatHTMLMessage(
                    {
                      id:
                        'paymentResults.successContent.reservedContent.paymentInstruction.convenienceStore.convenienceStoreAddress',
                    },
                    {
                      convenienceStoreAddress: get(bookingInfo, 'convenienceStoreAddress'),
                      bookingCode: get(bookingInfo, 'bookingCode'),
                    },
                  ),
                }}
              />
            ) : (
              // <div
              //   dangerouslySetInnerHTML={{
              //     __html: intl.formatHTMLMessage(
              //       { id: 'paymentResults.successContent.reservedContent.paymentInstruction.convenienceStore.noAddress' },
              //       {
              //         payooLink: get(bookingInfo, 'storesInfo') ? get(bookingInfo, 'storesInfo[0].LINK_MAP') : '',
              //         viettelPostLink: get(bookingInfo, 'storesInfo') ? get(bookingInfo, 'storesInfo[1].LINK_MAP') : '',
              //         bookingCode: get(bookingInfo, 'bookingCode'),
              //       },
              //     ),
              //   }}
              // />
              <p>
                <span>
                  {intl.formatHTMLMessage({
                    id:
                      'paymentResults.successContent.reservedContent.paymentInstruction.convenienceStore.noAddress.atAny',
                  })}
                </span>
                <span>
                  <a
                    href={get(bookingInfo, 'storesInfo[0].LINK_MAP')}
                    onClick={() => handleSendGATracking('cửa hàng tiện lợi')}
                    target="_blank"
                    className="link-style"
                  >
                    {intl.formatHTMLMessage({
                      id:
                        'paymentResults.successContent.reservedContent.paymentInstruction.convenienceStore.noAddress.convenienceStoreLabel',
                    })}
                  </a>
                </span>
                <span>
                  {intl.formatHTMLMessage({
                    id:
                      'paymentResults.successContent.reservedContent.paymentInstruction.convenienceStore.noAddress.or',
                  })}
                </span>
                <span>
                  <a
                    href={get(bookingInfo, 'storesInfo[1].LINK_MAP')}
                    onClick={() => handleSendGATracking('Bưu cục Vietel Post')}
                    target="_blank"
                    className="link-style"
                  >
                    {intl.formatHTMLMessage({
                      id:
                        'paymentResults.successContent.reservedContent.paymentInstruction.convenienceStore.noAddress.viettelPostLabel',
                    })}
                  </a>
                </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: intl.formatHTMLMessage(
                      {
                        id:
                          'paymentResults.successContent.reservedContent.paymentInstruction.convenienceStore.noAddress.note',
                      },
                      { bookingCode: get(bookingInfo, 'bookingCode') },
                    ),
                  }}
                />
              </p>
            )}
          </>
        );
      }
      case PAYMENT_METHOD.TRANSFER.id: {
        return (
          <div>
            <div>{intl.formatHTMLMessage({ id: 'paymentResults.successContent.reservedContent.paymentInstruction.transfer.accountInfo.transferLabel' })}</div>
            <div className="transfer-info">
              <div className="item">
                <div>{intl.formatHTMLMessage({ id: 'paymentResults.successContent.reservedContent.paymentInstruction.transfer.accountInfo.numAccountLabel' })}</div>
                <div><strong>{get(bookingInfo, 'bank.numberAccount')}</strong></div>
              </div>
              <div className="item">
                <div>{intl.formatHTMLMessage({ id: 'paymentResults.successContent.reservedContent.paymentInstruction.transfer.accountInfo.ownerAccountLabel' })}</div>
                <div><strong>{intl.formatHTMLMessage({ id: 'paymentResults.successContent.reservedContent.paymentInstruction.transfer.accountInfo.vxrAccountName' })}</strong></div>
              </div>
              <div className="item">
                <div>{intl.formatHTMLMessage({ id: 'paymentResults.successContent.reservedContent.paymentInstruction.transfer.accountInfo.bankLabel' })}</div>
                <div><strong>{get(bookingInfo, 'bank.name')}</strong></div>
              </div>
              <div className="item">
                <div>{intl.formatHTMLMessage({ id: 'paymentResults.successContent.reservedContent.paymentInstruction.transfer.accountInfo.priceLabel' })}</div>
                <div><strong>{get(bookingInfo, 'totalPrice').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</strong></div>
              </div>
              <div className="item">
                <div>{intl.formatHTMLMessage({ id: 'paymentResults.successContent.reservedContent.paymentInstruction.transfer.accountInfo.itransferInfoLabel' })}</div>
                <div><CopyText text={`${get(bookingInfo, 'bookingCode')} - ${get(bookingInfo, 'customer.phone')}`} /></div>
              </div>
            </div>
          </div>
        );
      }
      case PAYMENT_METHOD.AT_BUS_AGENT.id: {
        return (
          <>
            {get(bookingInfo, 'receiveTicketDate') && (
              <p
                dangerouslySetInnerHTML={{
                  __html: intl.formatHTMLMessage(
                    {
                      id:
                        'paymentResults.successContent.reservedContent.paymentInstruction.atBusAgent.receiveTime',
                    },
                    { receiveTime: get(bookingInfo, 'receiveTicketDate') },
                  ),
                }}
              />
            )}
            {get(bookingInfo, 'expiredTime') && (
              <p
                dangerouslySetInnerHTML={{
                  __html: intl.formatHTMLMessage(
                    {
                      id:
                        'paymentResults.successContent.reservedContent.paymentInstruction.atBusAgent.expiredTime',
                    },
                    { expiredTime: get(bookingInfo, 'expiredTime') },
                  ),
                }}
              />
            )}
            {!get(bookingInfo, 'expiredTime') && !get(bookingInfo, 'receiveTicketDate') && (
              <p
                dangerouslySetInnerHTML={{
                  __html: intl.formatHTMLMessage(
                    {
                      id:
                        'paymentResults.successContent.reservedContent.paymentInstruction.atBusAgent.noTime',
                    },
                  ),
                }}
              />
            )}
            <ListCompanyAgent
              compListBranchAndAgent={get(bookingInfo, 'compListBranchAndAgent')}
              viewListAgentLabel={intl.formatHTMLMessage({
                id:
                  'paymentResults.successContent.reservedContent.paymentInstruction.atBusAgent.viewListAgent',
              })}
              tel={intl.formatHTMLMessage({
                id:
                  'paymentResults.successContent.reservedContent.paymentInstruction.atBusAgent.tel',
              })}
              workingHoursLabel={intl.formatHTMLMessage({
                id:
                  'paymentResults.successContent.reservedContent.paymentInstruction.atBusAgent.workingHoursLabel',
              })}
            />
          </>
        );
      }
      case PAYMENT_METHOD.VEXERE_OFFICE.id: {
        return (
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: intl.formatHTMLMessage(
                  {
                    id:
                      'paymentResults.successContent.reservedContent.paymentInstruction.vxrOffice.instruction',
                  },
                  {
                    bookingCode: get(bookingInfo, 'bookingCode'),
                  },
                ),
              }}
            />
            <p>
              <span>
                {intl.formatHTMLMessage({
                  id:
                    'paymentResults.successContent.reservedContent.paymentInstruction.vxrOffice.addressLabel',
                })}
              </span>
              <span>{get(bookingInfo, 'vxrOffice')}</span>
            </p>
            <p>
              <span>
                {intl.formatHTMLMessage({
                  id:
                    'paymentResults.successContent.reservedContent.paymentInstruction.vxrOffice.timeWorkingLabel',
                })}
              </span>
              <span>{get(bookingInfo, 'vxrWorkingHours')}</span>
            </p>
          </>
        );
      }
      default: {
        console.log('Invalid choice');
        return <></>;
      }
    }
  };

  render() {
    const { intl, bookingInfo } = this.props;
    const { isDeposit, paymentTypeId } = bookingInfo;
    const instructionContent = this.getPaymentInstructionContent();
    return (
      <ReservedContentContainer>
        <div className="instruction-title">
          {intl.formatHTMLMessage({
            id: 'paymentResults.successContent.reservedContent.instructionTitle',
          })}
        </div>
        <PaymentInstructionContainer>
          {instructionContent}
          {paymentTypeId !== PAYMENT_METHOD.AT_BUS_AGENT.id && (
            <>
              {get(bookingInfo, 'expiredTime') && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: intl.formatHTMLMessage(
                      {
                        id:
                          'paymentResults.successContent.reservedContent.paymentInstruction.timeExpired',
                      },
                      { expiredTime: get(bookingInfo, 'expiredTime') },
                    ),
                  }}
                />
              )}
              <p>
                {isDeposit
                  ? intl.formatHTMLMessage({
                    id:
                        'paymentResults.successContent.reservedContent.paymentInstruction.isDeposit',
                  })
                  : intl.formatHTMLMessage({
                    id:
                        'paymentResults.successContent.reservedContent.paymentInstruction.notDeposit',
                  })}
              </p>
            </>
          )}
          {paymentTypeId === PAYMENT_METHOD.TRANSFER.id && (
            <div
              className="transfer-note"
              dangerouslySetInnerHTML={{
                __html: intl.formatHTMLMessage({
                  id:
                    'paymentResults.successContent.reservedContent.paymentInstruction.transfer.note',
                }),
              }}
            />
          )}
        </PaymentInstructionContainer>
      </ReservedContentContainer>
    );
  }
}

export default injectIntl(ReservedContent);
