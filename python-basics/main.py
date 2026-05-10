"""
名言API — FastAPI + SQLAlchemy + SQLite
"""

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

# -----------------------------------------------------------------------------
# データベース設定（SQLite + SQLAlchemy）
# quotes.db というファイルにテーブルとデータを保存する
# -----------------------------------------------------------------------------
DATABASE_URL = "sqlite:///./quotes.db"
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite を FastAPI と共有するための設定
)


# -----------------------------------------------------------------------------
# モデル定義の基底クラス（SQLAlchemy 2.0 スタイル）
# -----------------------------------------------------------------------------
class Base(DeclarativeBase):
    pass


# -----------------------------------------------------------------------------
# Quote テーブル — id（主キー）・名言本文・著者名
# -----------------------------------------------------------------------------
class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    content: Mapped[str] = mapped_column(Text(), nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)


# -----------------------------------------------------------------------------
# セッション作成 — リクエストごとに DB セッションを開いて閉じるために利用
# -----------------------------------------------------------------------------
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """依存注入用: 1リクエスト単位の DB セッションを yield する"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------------------------------------------------------
# 起動時: テーブル作成 & 空なら初期名言を5件投入
# -----------------------------------------------------------------------------
INITIAL_QUOTES = [
    {"content": "知は力なり", "author": "フランシス・ベーコン"},
    {"content": "我思う、ゆえに我あり", "author": "ルネ・デカルト"},
    {"content": "天国への道は地獄を通じてのみたどり着ける", "author": "ジョン・ミルトン"},
    {"content": "明日死ぬかのように生きよ。永遠に生きるかのように学べ", "author": "マハトマ・ガンディー"},
    {"content": "成功するために必要なのは、失敗を繰り返しても失志しないことだけだ", "author": "ウィンストン・チャーチル"},
]


def seed_quotes_if_empty(db: Session) -> None:
    """quotes テーブルが空のときだけ初期データを挿入する"""
    count = db.scalar(select(Quote.id).limit(1))
    if count is None:
        for row in INITIAL_QUOTES:
            db.add(Quote(content=row["content"], author=row["author"]))
        db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """アプリのライフサイクル: 起動時にスキーマ作成とシード、終了時は特になし"""
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_quotes_if_empty(db)
    yield


app = FastAPI(title="Quotes API", lifespan=lifespan)

# -----------------------------------------------------------------------------
# CORS — フロントエンドなど別オリジンからのリクエストを許可する
# （ブラウザからのAPI呼び出しで必要）
# -----------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------------------------------------------
# リクエスト/レスポンス用スキーマ（POST で受け取るボディの形）
# -----------------------------------------------------------------------------
class QuoteCreate(BaseModel):
    content: str = Field(..., min_length=1, description="名言の本文")
    author: str = Field(..., min_length=1, description="著者名")


class QuoteRead(BaseModel):
    id: int
    content: str
    author: str

    model_config = {"from_attributes": True}


# -----------------------------------------------------------------------------
# GET /items — 名言を全件取得
# -----------------------------------------------------------------------------
@app.get("/items", response_model=list[QuoteRead])
def list_items(db: Session = Depends(get_db)):
    quotes = db.scalars(select(Quote).order_by(Quote.id)).all()
    return quotes


# -----------------------------------------------------------------------------
# GET /items/{id} — 指定IDの名言を1件取得（無ければ404）
# -----------------------------------------------------------------------------
@app.get("/items/{item_id}", response_model=QuoteRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    quote = db.get(Quote, item_id)
    if quote is None:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote


# -----------------------------------------------------------------------------
# POST /items — 新しい名言を追加して作成されたレコードを返す
# -----------------------------------------------------------------------------
@app.post("/items", response_model=QuoteRead, status_code=201)
def create_item(payload: QuoteCreate, db: Session = Depends(get_db)):
    quote = Quote(content=payload.content, author=payload.author)
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote


# -----------------------------------------------------------------------------
# DELETE /items/{id} — 指定IDの名言を削除（無ければ404）
# -----------------------------------------------------------------------------
@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    quote = db.get(Quote, item_id)
    if quote is None:
        raise HTTPException(status_code=404, detail="Quote not found")
    db.delete(quote)
    db.commit()
    return None
