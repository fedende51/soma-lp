import { useEffect } from 'react'
import './coming-soon.css'

/**
 * Temporary holding page shown at the site root while the landing page is
 * finalised. Styling follows the SOMA private-preview page (renderpopstudio.com/soma).
 * The candidate landing versions stay reachable with `?v=<id>`.
 */

const BASE = import.meta.env.BASE_URL

export function ComingSoon() {
  useEffect(() => {
    document.documentElement.dataset.somaCs = ''
    document.title = 'SOMA · Coming soon'
  }, [])

  return (
    <main className="soma-cs">
      <div className="soma-cs__brand" role="img" aria-label="SOMA">
        <svg className="soma-cs__rings" viewBox="330 228 742 730" aria-hidden="true" focusable="false">
          <defs>
            <image id="soma-art" href={`${BASE}soma/soma-logo-light.png`} width="1400" height="1400" />
            <clipPath id="soma-clip-inner">
              <circle cx="700" cy="593" r="320" />
            </clipPath>
            <clipPath id="soma-clip-outer">
              <path clipRule="evenodd" d="M320 220H1080V966H320Z M1020 593a320 320 0 1 0-640 0a320 320 0 1 0 640 0Z" />
            </clipPath>
          </defs>
          <g className="soma-cs__ring soma-cs__ring--outer" clipPath="url(#soma-clip-outer)">
            <use href="#soma-art" />
          </g>
          <g className="soma-cs__ring soma-cs__ring--inner" clipPath="url(#soma-clip-inner)">
            <use href="#soma-art" />
          </g>
        </svg>
        <svg className="soma-cs__name" viewBox="104 1022 1193 147" aria-hidden="true" focusable="false">
          <use href="#soma-art" />
        </svg>
      </div>

      <h1 className="soma-cs__title">
        Coming <span>soon</span>
      </h1>
    </main>
  )
}
