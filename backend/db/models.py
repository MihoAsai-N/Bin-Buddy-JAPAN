"""
SQLAlchemy ORMモデル定義ファイル。

このモジュールでは、BinBuddyアプリのデータベース構造に対応するモデルクラスを定義している。
- ごみ分類情報（WasteItem, SortingNumber）
- 地区と郵便番号の関連情報（CityArea, AreaZipcodeHigashi）
- 多言語対応の翻訳情報（SortingTranslation, AddressTranslation）
- 管理者情報（AdminInfo）

各モデルは SQLAlchemy の Base クラスを継承しており、FastAPI + PostgreSQL 環境で使用される。
"""

from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Waste Items
class WasteItem(Base):
    """
    ごみ項目モデル。分類IDに紐づく個別のごみ項目名を保持する。
    """
    __tablename__ = "waste_item_with_id"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("sorting_numbers.id"), nullable=False)

    category = relationship("SortingNumber", back_populates="items")


# Sorting Numbers
class SortingNumber(Base):
    """
    ごみの分類カテゴリを表すモデル（例：可燃ごみ、不燃ごみなど）。
    """
    __tablename__ = "sorting_numbers"
    id = Column(Integer, primary_key=True )
    categories = Column(String, nullable=False)

    items = relationship("WasteItem", back_populates="category")
    translations = relationship("SortingTranslation", back_populates="sorting")
    area_sortings = relationship("AreaSorting", back_populates="sorting")


# Sorting Translations
class SortingTranslation(Base):
    """
    ごみの分類カテゴリに対応する多言語翻訳（日本語、英語、中国語）を保持する。
    """
    __tablename__ = "sorting_translations"
    id = Column(Integer, primary_key=True)
    sorting_id = Column(Integer, ForeignKey("sorting_numbers.id"), nullable=False)
    jp = Column(String)
    en = Column(String)
    zh = Column(String)

    sorting = relationship("SortingNumber", back_populates="translations")


# Sapporo City Area
class CityArea(Base):
    """
    札幌市の地区名モデル。地区と郵便番号や分類情報との関連を持つ。
    """
    __tablename__ = "sapporo_city_area"
    id = Column(Integer, primary_key=True)
    area = Column(String, nullable=False)
    area_id = Column(Integer)
    ward_id = Column(Integer)

    # zipcodes = relationship("AreaZipcodeHigashi", back_populates="city_area")
    # area_sortings = relationship("AreaSorting", back_populates="area_rel")


# Area Zipcode (Higashi-ku)
class AreaZipcodeHigashi(Base):
    """
    地区と郵便番号の対応関係を持つモデル（札幌市東区を対象）。
    """
    __tablename__ = "area_address_with_zipcode"
    id = Column(Integer, primary_key=True)
    area = Column(String)
    area_id = Column(Integer)
    area_en = Column(String)
    address = Column(String)
    zipcode = Column(String)



# Address Translations
class AddressTranslation(Base):
    """
    地区名の多言語翻訳（日本語、英語）を保持するモデル。
    """
    __tablename__ = "address_translation"
    id = Column(Integer, primary_key=True)
    jp = Column(String)
    en = Column(String)


# Area Sorting
class AreaSorting(Base):
    """
    地区ごとに対応するごみ分類IDとの関係を保持するモデル。
    """
    __tablename__ = "area_sorting"

    id = Column(Integer, primary_key=True)

    # 表示用や検索用に使う文字列（市区名とか）
    area = Column(String, nullable=True)  # 明示的に追加

    sorting_id = Column(Integer, ForeignKey("sorting_numbers.id"))

    sorting = relationship("SortingNumber", back_populates="area_sortings")
    # area_rel = relationship("CityArea", back_populates="area_sortings")

# AdminInfo
class AdminInfo(Base):
    """
    管理者の自治体情報を保持するモデル。ログイン情報なども含む。
    """
    __tablename__ = "admin_info"

    id = Column(Integer, primary_key=True)
    municipality_code = Column(String)
    municipality_name = Column(String)
    furigana = Column(String)
    postal_code = Column(String)
    address = Column(String)
    department = Column(String)
    contact_person = Column(String)
    phone_number = Column(String)
    email = Column(String)
    last_login = Column(DateTime)
    payment_status = Column(String)
    note = Column(String, nullable=True)
