import { useState, useMemo } from 'react'

const PRODUCTS = [
  { name: 'RC-02', spec: '규격 없음', price: 770000 },
  { name: '프라임', spec: 'RC-Prime300', price: 598000 },
  { name: '프라임S320', spec: 'RC-PrimeS320', price: 658000 },
  { name: '그래비티', spec: 'RC-GT500', price: 788000 },
  { name: '그래비티(W)', spec: 'RC-GT500W', price: 828000 },
  { name: '이지', spec: '규격 없음', price: 509000 },
  { name: '공용삽', spec: '규격 없음', price: 1500 },
  { name: '여과삽', spec: '규격 없음', price: 2000 },
  { name: '필터(그래비티/프라임)', spec: 'RC-GT500, RC-GT500W, RC-Prime300', price: 19800 },
  { name: '필터(RC-02)', spec: 'RC-02', price: 17000 },
  { name: '푸드클리너', spec: '1kg', price: 55000 },
  { name: '택배비', spec: '-', price: 3000 },
]

// 직접입력 항목 식별용 productIdx 값
const CUSTOM_IDX = -1

const SUPPLIER = {
  company: '㈜비앤테크',
  ceo: '방용휘',
  bizNo: '229-87-00918',
  type: '제조',
  industry: '음식물처리기',
  address: '경상남도 김해시 주촌면 골든루트로66번길 5 골든프라자 3층 304,305호',
  phone: '055-785-0665',
  fax: '055-785-0664',
}

const formatKRW = (n) =>
  '₩ ' + Math.round(Number(n) || 0).toLocaleString('ko-KR')

const todayISO = () => {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

let _nextId = 1
const newItem = (productIdx = 0) => ({
  id: _nextId++,
  productIdx,
  qty: 1,
  customName: '',   // 직접입력 품명
  customPrice: '',  // 직접입력 단가
})

export default function App() {
  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    phone: '',
    fax: '',
  })
  const [quoteDate, setQuoteDate] = useState(todayISO())
  const taxMode = 'inclusive' // 단가 = 부가세 포함 가격
  const [items, setItems] = useState([newItem(2)]) // 그래비티 기본
  const [memo, setMemo] = useState(
    '본 견적의 유효기간은 발행일로부터 14일입니다.'
  )

  const calculations = useMemo(() => {
    return items.map((it) => {
      const isCustom = it.productIdx === CUSTOM_IDX
      const p = isCustom
        ? {
            name: it.customName || '(직접입력)',
            spec: '-',
            price: Math.max(0, Number(it.customPrice) || 0),
          }
        : PRODUCTS[it.productIdx]
      const qty = Math.max(0, Number(it.qty) || 0)
      const unit = p.price
      let supply, vat, total
      if (taxMode === 'inclusive') {
        total = unit * qty
        supply = Math.round(total / 1.1)
        vat = total - supply
      } else {
        supply = unit * qty
        vat = Math.round(supply * 0.1)
        total = supply + vat
      }
      return { id: it.id, product: p, qty, unit, supply, vat, total }
    })
  }, [items, taxMode])

  const totals = useMemo(
    () =>
      calculations.reduce(
        (a, c) => ({
          supply: a.supply + c.supply,
          vat: a.vat + c.vat,
          total: a.total + c.total,
        }),
        { supply: 0, vat: 0, total: 0 }
      ),
    [calculations]
  )

  const addItem = () => setItems((s) => [...s, newItem(0)])
  const removeItem = (id) => setItems((s) => s.filter((x) => x.id !== id))
  const updateItem = (id, key, val) =>
    setItems((s) =>
      s.map((x) => (x.id === id ? { ...x, [key]: val } : x))
    )

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen">
      {/* ===== Toolbar (인쇄 시 숨김) ===== */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-[860px] mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="font-semibold text-sm tracking-wide">
            <span className="inline-block w-2 h-2 bg-black align-middle mr-2" />
            견적서 · ㈜비앤테크
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={addItem}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50"
            >
              + 품목
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs bg-black text-white rounded hover:bg-gray-800"
            >
              ↓ PDF 저장
            </button>
          </div>
        </div>
      </div>

      {/* ===== A4 페이지 ===== */}
      <div className="py-5">
        <div className="page text-[14px] text-gray-800">
          {/* 제목 */}
          <div className="text-center text-[32px] font-bold tracking-[10px] pl-[10px] mb-5">
            견 적 서
          </div>

          {/* 헤더: 좌(고객) / 우(공급자) */}
          <div className="grid grid-cols-2 gap-5 pb-4 mb-4 border-b-2 border-black">
            {/* 공급받는 자 */}
            <div className="flex flex-col gap-3 text-[14px]">
              <div className="flex items-center gap-2">
                <div className="w-16 font-semibold">성명/상호</div>
                <input
                  className="line-input flex-1"
                  placeholder="고객명"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
                <span className="text-gray-500 whitespace-nowrap">귀하</span>
              </div>
              {/* 주소: 긴 주소 자동 줄바꿈(2줄) — 잘림 방지 */}
              <div className="flex items-start gap-2">
                <div className="w-16 font-semibold pt-1">주소</div>
                <textarea
                  rows={2}
                  className="line-input flex-1 resize-y leading-snug"
                  placeholder="주소"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 font-semibold">전화</div>
                <input
                  className="line-input flex-1"
                  placeholder="전화번호"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 font-semibold">팩스</div>
                <input
                  className="line-input flex-1"
                  placeholder="팩스"
                  value={customer.fax}
                  onChange={(e) =>
                    setCustomer({ ...customer, fax: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 font-semibold">작성일자</div>
                <input
                  type="date"
                  className="line-input flex-1"
                  value={quoteDate}
                  onChange={(e) => setQuoteDate(e.target.value)}
                />
              </div>
            </div>

            {/* 공급자 박스 + 직인 */}
            <div className="relative border border-gray-300 rounded p-4 text-[13px]">
              <img
                src="/stamp.png"
                alt="직인"
                className="absolute right-3 top-3 w-[92px] h-[92px] object-contain opacity-90 pointer-events-none"
              />
              <div className="grid grid-cols-[70px_1fr] gap-y-2 pr-[100px]">
                <div className="font-semibold">상호</div>
                <div>{SUPPLIER.company}</div>
                <div className="font-semibold">대표자</div>
                <div>{SUPPLIER.ceo}</div>
                <div className="font-semibold">사업자</div>
                <div>{SUPPLIER.bizNo}</div>
                <div className="font-semibold">업태</div>
                <div>
                  {SUPPLIER.type} / {SUPPLIER.industry}
                </div>
                <div className="font-semibold">주소</div>
                <div className="text-[12px] leading-snug">
                  {SUPPLIER.address}
                </div>
                <div className="font-semibold">연락처</div>
                <div>
                  {SUPPLIER.phone} (Fax {SUPPLIER.fax})
                </div>
              </div>
            </div>
          </div>

          {/* 합계 강조 박스 */}
          <div className="bg-black text-white rounded px-5 py-4 my-3 flex items-end justify-between">
            <div>
              <div className="text-[13px] text-gray-400 mb-1.5">총 견적금액</div>
              <div className="text-[30px] font-bold leading-none">
                {formatKRW(totals.total)}
              </div>
            </div>
            <div className="text-[13px] text-gray-400 text-right">
              공급가액 {formatKRW(totals.supply)}
              <span className="mx-1">+</span>
              부가세 {formatKRW(totals.vat)}
            </div>
          </div>

          {/* 품목 테이블 */}
          <table className="w-full border-collapse text-[14px] my-3">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-2.5 w-[6%]">
                  No
                </th>
                <th className="border border-gray-300 px-2 py-2.5 w-[34%] text-left">
                  품명
                </th>
                <th className="border border-gray-300 px-2 py-2.5 w-[10%]">
                  수량
                </th>
                <th className="border border-gray-300 px-2 py-2.5 w-[16%] text-right">
                  단가
                </th>
                <th className="border border-gray-300 px-2 py-2.5 w-[18%] text-right">
                  공급가액
                </th>
                <th className="border border-gray-300 px-2 py-2.5 w-[16%] text-right">
                  부가세
                </th>
                <th className="border border-gray-300 px-1 py-2.5 w-[6%] no-print">
                  ·
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-300 text-center text-gray-400 py-5"
                  >
                    품목을 추가해주세요
                  </td>
                </tr>
              )}
              {items.map((it, idx) => {
                const c = calculations[idx]
                const isCustom = it.productIdx === CUSTOM_IDX
                return (
                  <tr key={it.id}>
                    <td className="border border-gray-300 text-center py-2">
                      {idx + 1}
                    </td>
                    <td className="border border-gray-300 px-2">
                      <select
                        className="cell-input"
                        value={it.productIdx}
                        onChange={(e) =>
                          updateItem(
                            it.id,
                            'productIdx',
                            Number(e.target.value)
                          )
                        }
                      >
                        {PRODUCTS.map((pr, i) => (
                          <option key={i} value={i}>
                            {pr.name}
                          </option>
                        ))}
                        <option value={CUSTOM_IDX}>직접입력</option>
                      </select>
                      {isCustom && (
                        <input
                          className="cell-input mt-1 border-b border-gray-300"
                          placeholder="품명 직접입력"
                          value={it.customName}
                          onChange={(e) =>
                            updateItem(it.id, 'customName', e.target.value)
                          }
                        />
                      )}
                    </td>
                    <td className="border border-gray-300 text-center">
                      <input
                        type="number"
                        min="0"
                        className="cell-input text-center"
                        value={it.qty}
                        onChange={(e) =>
                          updateItem(it.id, 'qty', e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 text-right px-2">
                      {isCustom ? (
                        <input
                          type="number"
                          min="0"
                          className="cell-input text-right"
                          placeholder="0"
                          value={it.customPrice}
                          onChange={(e) =>
                            updateItem(it.id, 'customPrice', e.target.value)
                          }
                        />
                      ) : (
                        formatKRW(c.unit)
                      )}
                    </td>
                    <td className="border border-gray-300 text-right px-2">
                      {formatKRW(c.supply)}
                    </td>
                    <td className="border border-gray-300 text-right px-2">
                      {formatKRW(c.vat)}
                    </td>
                    <td className="border border-gray-300 text-center no-print">
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="삭제"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td
                  colSpan={4}
                  className="border border-gray-300 text-right px-3 py-2"
                >
                  합계
                </td>
                <td className="border border-gray-300 text-right px-2">
                  {formatKRW(totals.supply)}
                </td>
                <td className="border border-gray-300 text-right px-2">
                  {formatKRW(totals.vat)}
                </td>
                <td className="border border-gray-300 no-print"></td>
              </tr>
            </tfoot>
          </table>

          {/* 비고 (수정 가능) */}
          <div className="border border-gray-300 rounded p-3 mt-4 hover:border-gray-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-[13px]">비고</div>
              <div className="text-[10px] text-gray-400 no-print">↳ 클릭해서 수정</div>
            </div>
            <textarea
              className="w-full min-h-[64px] text-[13px] resize-y border border-gray-200 rounded p-2 outline-none bg-white focus:border-gray-700"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="비고 사항을 입력하세요"
            />
          </div>

          <div className="text-center text-[11px] text-gray-400 mt-4">
            본 견적서는 입력된 품목·수량·단가를 기준으로 공급가액 및 부가세가 자동
            계산됩니다.
          </div>
        </div>
      </div>
    </div>
  )
}
